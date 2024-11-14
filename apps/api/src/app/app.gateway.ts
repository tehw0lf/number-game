import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { environment, Player } from '@number-game/core';
import generateAvatar from 'github-like-avatar-generator';

const connectedClients = new Map<
  string,
  { sessionID: string; socket: WebSocket }
>();

const winningNumbers = new Map<
  string,
  { uuid: string; winningNumber: number }
>();
const sessionInfo = new Map<
  string,
  {
    winningNumber: number;
    players: Player[];
  }
>();

@WebSocketGateway(environment.api_port)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss: any;

  private logger = new Logger('AppGateway');

  private minimumSessionID = 100000;
  private maximumSessionID = 999999;

  afterInit() {
    this.logger.log('WebSocketServer initialized');
  }

  handleConnection(clientSocket: WebSocket) {
    this.logger.log('New client connected');
  }

  handleDisconnect(clientSocket: WebSocket) {
    let clientUuid;
    connectedClients.forEach(
      (client: { sessionID: string; socket: WebSocket }, uuid) => {
        if (client.socket === clientSocket) {
          this.leaveSession(client.sessionID, uuid);
          clientUuid = uuid;
        }
      }
    );
    connectedClients.delete(clientUuid);
    this.logger.log(`Client ${clientUuid} disconnected.`);
  }

  private restartRound(sessionID: string): void {
    winningNumbers.set(sessionID, undefined);
    sessionInfo.get(sessionID).winningNumber = -1;
    sessionInfo.get(sessionID).players.forEach((player: Player) => {
      player.guess = -1;
      player.won = false;
    });
    this.broadcastToClients(sessionID, 'restart', sessionInfo.get(sessionID));
  }

  @SubscribeMessage('leaveSession')
  handleIncomingLeaveSessionMessage(
    clientSocket: WebSocket,
    data: {
      uuid: string;
      sessionID: string;
    }
  ) {
    this.logger.log(`'leaveSession': ${JSON.stringify(data)}`);
    let clientInSession = false;
    if (sessionInfo.get(data.sessionID)) {
      sessionInfo.get(data.sessionID).players.forEach((player: Player) => {
        if (player.uuid === data.uuid) {
          clientInSession = true;
        }
      });
    }

    if (clientInSession) {
      this.leaveSession(data.sessionID, data.uuid);
    }
  }

  @SubscribeMessage('newRound')
  handleIncomingNewRoundMessage(
    clientSocket: WebSocket,
    data: { uuid: string; sessionID: string }
  ) {
    this.logger.log(`'newRound': ${JSON.stringify(data)}`);
    let restartRequestValid = false;
    if (sessionInfo.get(data.sessionID)) {
      sessionInfo.get(data.sessionID).players.forEach((player: Player) => {
        if (player.uuid === data.uuid) {
          restartRequestValid = true;
        }
      });
    }

    if (restartRequestValid) {
      this.restartRound(data.sessionID);
    }
  }

  @SubscribeMessage('guess')
  handleIncomingGuessMessage(
    clientSocket: WebSocket,
    data: { uuid: string; sessionID: string; guess: number }
  ): void {
    if (!winningNumbers.get(data.sessionID)) {
      winningNumbers.set(data.sessionID, {
        uuid: data.uuid,
        winningNumber: Math.abs(data.guess),
      });
      data.guess = undefined; // we dont want the other players to know how to win
    }
    const winningUuid = winningNumbers.get(data.sessionID).uuid;
    sessionInfo.get(data.sessionID).players.forEach((player: Player) => {
      if (player.uuid === data.uuid) {
        if (player.uuid === winningUuid) {
          player.guess = undefined;
        } else {
          player.guess = data.guess;
        }
      }
    });

    const numOfPlayers = sessionInfo.get(data.sessionID).players.length;
    const guesses = this.getGuesses(data.sessionID);
    if (guesses.length === numOfPlayers - 1 && guesses.length > 0) {
      this.calculateWinners(data.sessionID, guesses);
    }
    this.broadcastToClients(
      data.sessionID,
      'running',
      sessionInfo.get(data.sessionID)
    );
  }

  private getGuesses(sessionID: string): { uuid: string; guess: number }[] {
    const guesses = [];
    sessionInfo.get(sessionID).players.forEach((player: Player) => {
      if (player.guess >= 0) {
        guesses.push({ uuid: player.uuid, guess: player.guess });
      }
    });
    return guesses;
  }

  private calculateWinners(
    sessionID: string,
    guesses: { uuid: string; guess: number }[]
  ): void {
    let currentWinners: string[];
    let currentWinningDistance = Math.min(); //Infinity
    const winningNumber = winningNumbers.get(sessionID).winningNumber;
    guesses.forEach((pair) => {
      const distance = Math.abs(pair.guess - winningNumber);
      if (distance < currentWinningDistance) {
        currentWinners = [pair.uuid];
        currentWinningDistance = distance;
      } else if (distance === currentWinningDistance) {
        currentWinners.push(pair.uuid);
      }
    });
    sessionInfo.get(sessionID).players.forEach((player: Player) => {
      if (currentWinners.includes(player.uuid)) {
        player.won = true;
      }
    });
    sessionInfo.get(sessionID).winningNumber = winningNumber;
  }

  @SubscribeMessage('joinSession')
  handleInitializeClientMessage(
    clientSocket: WebSocket,
    data: { uuid: string; sessionID: string; name: string }
  ): void {
    const newSessionID = data.sessionID
      ? data.sessionID
      : this.generateSessionID();
    const newClientID = data.uuid ? data.uuid : this.generateClientID();
    const pic = generateAvatar({
      blocks: 6,
      width: 100,
    }).base64;

    if (!sessionInfo.has(data.sessionID)) {
      const players = [
        {
          uuid: newClientID,
          name: data.name,
          pic,
          guess: -1,
          won: false,
        },
      ];

      sessionInfo.set(newSessionID, {
        winningNumber: -1,
        players: players,
      });
    } else {
      let playerExists = false;
      sessionInfo.get(data.sessionID).players.forEach((player: Player) => {
        if (player.uuid === newClientID) {
          playerExists = true;
        }
      });
      if (!playerExists) {
        sessionInfo.get(data.sessionID).players.push({
          uuid: newClientID,
          name: data.name,
          pic,
          guess: -1,
          won: false,
        });
      }
    }

    connectedClients.set(newClientID, {
      sessionID: newSessionID,
      socket: clientSocket,
    });
    clientSocket.send(
      JSON.stringify({
        eventType: 'join',
        serverState: {
          uuid: newClientID,
          name: data.name,
          pic,
          sessionID: newSessionID,
        },
      })
    );
    this.broadcastToClients(
      newSessionID,
      'running',
      sessionInfo.get(newSessionID)
    );
  }

  private generateSessionID(): string {
    this.minimumSessionID = Math.ceil(this.minimumSessionID);
    this.maximumSessionID = Math.floor(this.maximumSessionID);
    const id =
      Math.floor(
        Math.random() * (this.maximumSessionID - this.minimumSessionID + 1)
      ) + this.minimumSessionID;
    if (sessionInfo.has(id.toString())) {
      this.generateSessionID();
    } else {
      return id.toString();
    }
  }

  private generateClientID(): string {
    return `${Math.floor(Date.now() * Math.random() * Math.random())}`;
  }

  private broadcastToClients(
    sessionID: string,
    eventType: string,
    serverState: any
  ): void {
    sessionInfo.get(sessionID).players.forEach((player: Player) => {
      connectedClients
        .get(player.uuid)
        .socket.send(JSON.stringify({ eventType, serverState }));
    });
  }

  private leaveSession(sessionID: string, uuid: string): void {
    if (sessionInfo.get(sessionID)) {
      const players = sessionInfo
        .get(sessionID)
        .players.filter((player: Player) => player.uuid !== uuid);
      if (players.length === 0) {
        this.logger.log(`Last player left, deleting session ${sessionID}`);
        sessionInfo.delete(sessionID);
      } else {
        sessionInfo.get(sessionID).players = players;
        this.broadcastToClients(
          sessionID,
          'running',
          sessionInfo.get(sessionID)
        );
      }
    }
  }
}
