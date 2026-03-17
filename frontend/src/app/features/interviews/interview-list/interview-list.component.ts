import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-interview-list',
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Entrevistas</h1>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterviewListComponent {}
