import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="grid min-h-screen place-items-center bg-stone-50 px-4 py-8">
      <div class="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <p class="text-sm font-bold uppercase tracking-wide text-emerald-700">Plantilla Parcial</p>
        <h1 class="mt-2 text-2xl font-black text-stone-950">Registro</h1>
        <p class="mt-2 text-sm text-stone-600">Crea un usuario con rol USER para probar el flujo base.</p>

        @if (error()) {
          <div class="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {{ error() }}
          </div>
        }

        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <label class="block">
            <span class="text-sm font-bold text-stone-700">Nombre</span>
            <input type="text" formControlName="nombre"
                   class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </label>
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
            {{ loading() ? 'Creando...' : 'Crear cuenta' }}
          </button>
        </form>

        <p class="mt-5 text-center text-sm text-stone-600">
          Ya tienes cuenta?
          <a routerLink="/login" class="font-bold text-emerald-700 hover:text-emerald-900">Entrar</a>
        </p>
      </div>
    </section>
  `
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error.set('No se pudo crear el usuario. Puede que el correo ya exista.');
        this.loading.set(false);
      }
    });
  }
}
