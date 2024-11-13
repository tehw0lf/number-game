import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Player, SessionUser, UserInfo } from '@number-game/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  sessionUser: WritableSignal<SessionUser | null> = signal(null);
  players: WritableSignal<Player[]> = signal([]);
  userInfo: WritableSignal<UserInfo | null> = signal(null);
  userGuess: WritableSignal<number> = signal(-1);
  session: WritableSignal<any | null> = signal(null);
  winningNumber: WritableSignal<number> = signal(-1);

  winners: Signal<Player[]> = computed(() =>
    this.players().filter((player: Player) => player.won)
  );

  isNumberDecider = computed(
    () =>
      this.sessionUser()?.uuid !== '' &&
      this.players().filter(
        (player: Player) =>
          this.sessionUser()?.uuid === player.uuid && player.guess === undefined
      ).length > 0
  );

  isWinner = computed(
    () =>
      this.sessionUser()?.uuid !== '' &&
      this.players().filter(
        (player: Player) =>
          this.sessionUser()?.uuid === player.uuid && player.won
      ).length > 0
  );

  canVisitHome = computed(() =>
    this.sessionUser()?.sessionID !== '' && this.sessionUser()?.uuid !== ''
      ? true
      : false
  );

  canVisitResult = computed(() =>
    this.sessionUser()?.sessionID !== '' &&
    this.sessionUser()?.uuid !== '' &&
    this.userGuess() >= 0
      ? true
      : false
  );

  resetSession(): void {
    this.sessionUser.set(null);
    this.players.set([]);
    this.userGuess.set(-1);
    this.session.set(null);
    this.winningNumber.set(-1);
  }

  resetUserInfo(): void {
    this.userInfo.set(null);
  }
}
