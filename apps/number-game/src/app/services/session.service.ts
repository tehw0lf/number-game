import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@number-game/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { StateService } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private router: Router = inject(Router);
  private stateService: StateService = inject(StateService);

  private closeSubject$ = new Subject();
  private subject$: WebSocketSubject<any> = webSocket({
    url: `${environment.api_url}:${environment.api_port}`,
    closeObserver: this.closeSubject$,
  });

  closeObservable$: Observable<any> = this.closeSubject$.asObservable();

  initializeConnection(): Observable<any> {
    return this.subject$.asObservable().pipe(
      tap((data: { eventType: string; serverState: any }) => {
        this.handleIncomingData(data.eventType, data.serverState);
      })
    );
  }

  handleIncomingData(eventType: string, serverState: any) {
    switch (eventType) {
      case 'join':
        this.stateService.userInfo.set({
          name: serverState.name,
          pic: serverState.pic,
        });
        this.stateService.sessionUser.set({
          uuid: serverState.uuid,
          sessionID: serverState.sessionID,
        });
        this.router.navigate(['home']);
        break;

      case 'restart':
        serverState.userGuess = -1;
        this.stateService.session.set(serverState);
        this.router.navigate(['home']);
        break;

      case 'running':
        this.stateService.session.set(serverState);
        break;

      default:
        throw new Error('default case, this should never happen');
    }
  }

  leaveSession(): void {
    this.subject$.next({
      event: 'leaveSession',
      data: this.stateService.sessionUser(),
    });
    this.router.navigate(['join']);
  }

  joinSession(name: string, pic: string, sessionID: string): void {
    this.closeObservable$.subscribe(() => {
      this.stateService.resetSession();
    });
    this.subject$.next({
      event: 'joinSession',
      data: {
        uuid: '',
        sessionID,
        name,
        pic,
      },
    });
  }

  sendGuess(guess: number): void {
    this.subject$.next({
      event: 'guess',
      data: {
        uuid: this.stateService.sessionUser()?.uuid,
        sessionID: this.stateService.sessionUser()?.sessionID,
        guess,
      },
    });
    this.stateService.userGuess.set(guess);
    this.router.navigate(['result']);
  }

  newRound(): void {
    this.subject$.next({
      event: 'newRound',
      data: {
        uuid: this.stateService.sessionUser()?.uuid,
        sessionID: this.stateService.sessionUser()?.sessionID,
      },
    });
  }
}
