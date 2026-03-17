import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-job-list',
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold">Ofertas de empleo</h1>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListComponent {}
