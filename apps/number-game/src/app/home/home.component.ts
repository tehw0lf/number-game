import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Player } from '@number-game/core';

import { SessionService } from '../services/session.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  guess: WritableSignal<number | undefined> = signal(-1);

  public stateService: StateService = inject(StateService);
  private sessionService: SessionService = inject(SessionService);

  hasGuessed(player: Player): boolean {
    if (player.guess === undefined || player.guess >= 0) {
      return true;
    }
    return false;
  }

  leaveSession(): void {
    this.sessionService.leaveSession();
  }

  sendGuess(): void {
    if (this.guess()) {
      this.sessionService.sendGuess(this.guess());
      this.guess.set(-1);
    } else {
      console.error('Please enter a number first, currently it is', this.guess);
    }
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.stateService.sessionUser()!.sessionID);
  }
}
