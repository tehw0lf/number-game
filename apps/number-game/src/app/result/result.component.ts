import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Player } from '@number-game/core';

import { SessionService } from '../services/session.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent {
  public stateService: StateService = inject(StateService);
  private sessionService: SessionService = inject(SessionService);

  hasGuessed(player: Player): boolean {
    if (player.guess >= 0 || player.guess === undefined) {
      return true;
    }
    return false;
  }

  newRound(): void {
    this.sessionService.newRound();
  }

  leaveSession(): void {
    this.sessionService.leaveSession();
  }
}
