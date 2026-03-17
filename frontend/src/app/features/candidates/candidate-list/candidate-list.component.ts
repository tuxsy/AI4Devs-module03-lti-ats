import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-candidate-list',
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Candidatos</h1>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListComponent {}
