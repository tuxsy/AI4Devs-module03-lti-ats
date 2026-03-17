import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div class="max-w-2xl w-full text-center">
        <div class="mb-6 text-6xl">🚀</div>
        <h1 class="text-5xl font-bold text-indigo-700 mb-4">LTI ATS</h1>
        <p class="text-xl text-gray-600 mb-2">Applicant Tracking System</p>
        <p class="text-gray-500 mb-10">El sistema está funcionando correctamente.</p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <a
            routerLink="/jobs"
            class="block p-6 bg-white rounded-2xl shadow hover:shadow-md transition-shadow border border-indigo-100"
          >
            <div class="text-3xl mb-2">💼</div>
            <h2 class="font-semibold text-gray-800">Ofertas</h2>
            <p class="text-sm text-gray-500 mt-1">Gestión de empleo</p>
          </a>
          <a
            routerLink="/candidates"
            class="block p-6 bg-white rounded-2xl shadow hover:shadow-md transition-shadow border border-indigo-100"
          >
            <div class="text-3xl mb-2">👤</div>
            <h2 class="font-semibold text-gray-800">Candidatos</h2>
            <p class="text-sm text-gray-500 mt-1">Base de talento</p>
          </a>
          <a
            routerLink="/interviews"
            class="block p-6 bg-white rounded-2xl shadow hover:shadow-md transition-shadow border border-indigo-100"
          >
            <div class="text-3xl mb-2">📅</div>
            <h2 class="font-semibold text-gray-800">Entrevistas</h2>
            <p class="text-sm text-gray-500 mt-1">Agenda y seguimiento</p>
          </a>
        </div>

        <p class="text-xs text-gray-400">
          Frontend Angular · Backend NestJS ·
          <a
            href="http://localhost:3000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            class="text-indigo-400 hover:underline"
          >API Docs</a>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
