import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="grid min-h-screen place-items-center bg-stone-50 px-4 py-8">
      <div class="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <div class="mb-6">
          <p class="text-sm font-bold uppercase tracking-wide text-red-700">Carniceria Buen Corte</p>
          <h1 class="mt-2 text-2xl font-black text-stone-950">Ingreso</h1>
          <p class="mt-2 text-sm text-stone-600">Gestion de productos carnicos, clientes y pedidos.</p>
        </div>

        @if (error()) {
          <div class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {{ error() }}
          </div>
        }

        <form class="space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <label class="block">
            <span class="text-sm font-bold text-stone-700">Correo</span>
            <input type="email" formControlName="email"
                   class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </label>

          <label class="block">
            <span class="text-sm font-bold text-stone-700">Contrasena</span>
            <input type="password" formControlName="password"
                   class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </label>

          <button type="submit" [disabled]="form.invalid || loading()"
                  class="w-full rounded-lg bg-emerald-700 px-4 py-2.5 font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300">
            {{ loading() ? 'Ingresando...' : 'Entrar' }}
          </button>
        </form>

        <div class="mt-5 grid gap-2">
          @for (demo of demos; track demo.email) {
            <button type="button" (click)="fillDemo(demo.email, demo.password)"
                    class="rounded-lg border border-stone-200 px-3 py-2 text-left text-sm hover:bg-stone-50">
              <span class="font-bold text-stone-800">{{ demo.label }}</span>
              <span class="text-stone-500"> · {{ demo.email }}</span>
            </button>
          }
        </div>

        <p class="mt-5 text-center text-sm text-stone-600">
          No tienes cuenta?
          <a routerLink="/registro" class="font-bold text-emerald-700 hover:text-emerald-900">Crear usuario</a>
        </p>
      </div>
    </section>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly demos = [
    { label: 'Admin', email: 'admin@app.com', password: 'admin123' },
    { label: 'Cliente', email: 'user@app.com', password: 'user123' }
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  fillDemo(email: string, password: string): void {
    this.form.setValue({ email, password });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error.set('No se pudo iniciar sesion. Revisa las credenciales.');
        this.loading.set(false);
      }
    });
  }
}
