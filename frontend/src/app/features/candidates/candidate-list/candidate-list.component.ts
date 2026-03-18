import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-candidate-list',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-white font-mono">
      <nav class="border-b-4 border-black p-4 flex items-center gap-4 bg-yellow-300">
        <a
          routerLink="/"
          class="text-xs font-bold uppercase border-2 border-black px-3 py-1 hover:bg-black hover:text-white"
          >&larr; Inicio</a
        >
        <span class="font-bold uppercase tracking-widest text-sm">LTI ATS</span>
      </nav>
      <div class="p-8">
        <div class="border-4 border-black p-6 mb-6">
          <h1 class="text-4xl font-bold uppercase">Candidatos</h1>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateListComponent {}
