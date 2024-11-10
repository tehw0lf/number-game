import { TestBed } from '@angular/core/testing';

import { StateService } from './state.service';

const mockUser = { sessionUser: { uuid: '', sessionID: '' } };

const mockPlayers = {
  players: [{ uuid: '123', name: '', pic: '', guess: 0, won: false }],
};

const mockWinnersOneWinner = {
  players: [
    { uuid: '123', name: '', pic: '', guess: 0, won: true },
    { uuid: '132', name: '', pic: '', guess: 0, won: false },
    { uuid: '231', name: '', pic: '', guess: 0, won: false },
  ],
};
const mockWinnersTwoWinners = {
  players: [
    { uuid: '123', name: '', pic: '', guess: 0, won: true },
    { uuid: '132', name: '', pic: '', guess: 0, won: true },
    { uuid: '231', name: '', pic: '', guess: 0, won: false },
  ],
};
const mockWinnersNoWinners = {
  players: [
    { uuid: '123', name: '', pic: '', guess: 0, won: false },
    { uuid: '132', name: '', pic: '', guess: 0, won: false },
    { uuid: '231', name: '', pic: '', guess: 0, won: false },
  ],
};

const mockUserGuessValid = { userGuess: 0 };
const mockUserGuessInvalid = { userGuess: -1 };

const mockWinningNumberValid = { winningNumber: 0 };
const mockWinningNumberInvalid = { winningNumber: -1 };

const mockNumberDecider = {
  sessionUser: { uuid: '123', sessionID: '' },
  players: [{ uuid: '123', name: '', pic: '', guess: undefined, won: false }],
};
const mockNoNumberDecider = {
  sessionUser: { uuid: '123', sessionID: '' },
  players: [{ uuid: '123', name: '', pic: '', guess: -1, won: false }],
};

const mockIsWinner = {
  sessionUser: { uuid: '123', sessionID: '' },
  players: [{ uuid: '123', name: '', pic: '', guess: 0, won: true }],
};
const mockIsNoWinner = {
  sessionUser: { uuid: '123', sessionID: '' },
  players: [{ uuid: '123', name: '', pic: '', guess: 0, won: false }],
};
const mockIsInvalidWinner = {
  sessionUser: { uuid: '', sessionID: '' },
  players: [{ uuid: '', name: '', pic: '', guess: 0, won: true }],
};

const mockCanVisitHome = { sessionUser: { uuid: '123', sessionID: '123456' } };
const mockCanNotVisitHome = { sessionUser: { uuid: '', sessionID: '' } };

const mockCanVisitResult = {
  sessionUser: { uuid: '123', sessionID: '123456' },
  userGuess: 0,
};
const mockCanNotVisitResult = {
  sessionUser: { uuid: '', sessionID: '' },
  userGuess: -1,
};

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: { data: mockUser },
    });
    query.user$.subscribe((user: SessionUser) => {
      expect(user).toBe(mockUser.sessionUser);
      done();
    });
  });

  it('should return the players', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: { data: mockPlayers },
    });
    query.players$.subscribe((players: Player[]) => {
      expect(players).toBe(mockPlayers.players);
      done();
    });
  });

  it('should return one winner if one player has won', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: { data: mockWinnersOneWinner },
    });
    query.winners$.subscribe((winners: Player[]) => {
      expect(winners.length).toBe(1);
      done();
    });
  });

  it('should return two winners if two players have won', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: { data: mockWinnersTwoWinners },
    });
    query.winners$.subscribe((winners: Player[]) => {
      expect(winners.length).toBe(2);
      done();
    });
  });

  it('should return no winners if no players have won', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: { data: mockWinnersNoWinners },
    });
    query.winners$.subscribe((winners: Player[]) => {
      expect(winners.length).toBe(0);
      done();
    });
  });

  it('should return the guessed number if it is greater than 0', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: { data: mockUserGuessValid },
    });
    query.userGuess$.subscribe((guess: number) => {
      expect(guess).toBe(mockUserGuessValid.userGuess);
      done();
    });
  });

  it('should not return the guessed number if it is below 0', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: { data: mockUserGuessInvalid },
    });
    query.userGuess$.subscribe((guess: number) => {
      expect(guess).toBe(undefined);
      done();
    });
  });

  it('should return the winning number if it is greater than 0', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: { data: mockWinningNumberValid },
    });
    query.winningNumber$.subscribe((winningNumber: number) => {
      expect(winningNumber).toBe(mockWinningNumberValid.winningNumber);
      done();
    });
  });

  it('should not return the winning number if it is below 0', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: { data: mockWinningNumberInvalid },
    });
    query.winningNumber$.subscribe((winningNumber: number) => {
      expect(winningNumber).toBe(undefined);
      done();
    });
  });

  it('should return true if a player has decided a number', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: {
        data: mockNumberDecider,
      },
    });
    query.isNumberDecider$.subscribe((isNumberDecider) => {
      expect(isNumberDecider).toBeTruthy();
      done();
    });
  });

  it('should return false if a player has not decided a number', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: {
        data: mockNoNumberDecider,
      },
    });
    query.isNumberDecider$.subscribe((isNumberDecider) => {
      expect(isNumberDecider).toBeFalsy();
      done();
    });
  });

  it('should return true if a player has won', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: {
        data: mockIsWinner,
      },
    });
    query.isWinner$.subscribe((isWinner) => {
      expect(isWinner).toBeTruthy();
      done();
    });
  });

  it('should return false if no player has won', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: {
        data: mockIsNoWinner,
      },
    });
    query.isWinner$.subscribe((isWinner) => {
      expect(isWinner).toBeFalsy();
      done();
    });
  });

  it('should return false if the player has no uuid', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: {
        data: mockIsInvalidWinner,
      },
    });
    query.isWinner$.subscribe((isWinner) => {
      expect(isWinner).toBeFalsy();
      done();
    });
  });

  it('should visit home if a session is established', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: {
        data: mockCanVisitHome,
      },
    });
    query.canVisitHome$.subscribe((canVisitHome) => {
      expect(canVisitHome).toBeTruthy();
      done();
    });
  });

  it('should not visit home if no session is established', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: {
        data: mockCanNotVisitHome,
      },
    });
    query.canVisitHome$.subscribe((canVisitHome) => {
      expect(canVisitHome).toBeFalsy();
      done();
    });
  });
  it('should visit result if a session is established and a guess is set', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: {
        data: mockCanVisitResult,
      },
    });
    query.canVisitResult$.subscribe((canVisitResult) => {
      expect(canVisitResult).toBeTruthy();
      done();
    });
  });

  it('should not visit result if no session is established and no guess is set', (done: jest.DoneCallback) => {
    runStoreAction('session', StoreActions.Update, {
      payload: {
        data: mockCanNotVisitResult,
      },
    });
    query.canVisitResult$.subscribe((canVisitResult) => {
      expect(canVisitResult).toBeFalsy();
      done();
    });
  });
});
