import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-white p-6 md:p-10 font-mono">
      <header class="border-4 border-black p-6 bg-yellow-300 mb-4">
        <h1 class="text-6xl font-bold uppercase tracking-tighter leading-none">LTI ATS</h1>
        <p class="text-sm font-bold uppercase tracking-widest mt-2">Applicant Tracking System</p>
      </header>

      <div class="border-4 border-black bg-black text-white px-4 py-2 mb-6">
        <p class="text-xs font-bold uppercase tracking-widest">
          Sistema operativo &middot; Estado: OK
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <a routerLink="/jobs" class="block p-8 border-4 border-black hover:bg-yellow-300">
          <div class="text-4xl font-bold mb-4">01/</div>
          <h2 class="text-2xl font-bold uppercase mb-1">Ofertas</h2>
          <p class="text-sm uppercase font-bold text-gray-600">Gestión de empleo &rarr;</p>
        </a>
        <a routerLink="/candidates" class="block p-8 border-4 border-black hover:bg-yellow-300">
          <div class="text-4xl font-bold mb-4">02/</div>
          <h2 class="text-2xl font-bold uppercase mb-1">Candidatos</h2>
          <p class="text-sm uppercase font-bold text-gray-600">Base de talento &rarr;</p>
        </a>
        <a routerLink="/interviews" class="block p-8 border-4 border-black hover:bg-yellow-300">
          <div class="text-4xl font-bold mb-4">03/</div>
          <h2 class="text-2xl font-bold uppercase mb-1">Entrevistas</h2>
          <p class="text-sm uppercase font-bold text-gray-600">Agenda y seguimiento &rarr;</p>
        </a>
      </div>

      <footer class="border-4 border-black p-4 flex flex-wrap justify-between items-center gap-2">
        <span class="text-xs font-bold uppercase tracking-widest"
          >Angular &middot; NestJS &middot; PostgreSQL</span
        >
        <a
          href="http://localhost:3000/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-bold uppercase underline hover:bg-black hover:text-white px-2 py-1"
          >API Docs &nearr;</a
        >
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
