import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, RouterOutlet],
  template: `
    <div class="app-shell">
      <app-navbar />
      <main class="mx-auto max-w-6xl px-4 py-6">
        <router-outlet />
      </main>
    </div>
  `
})
export class LayoutComponent {
  private readonly auth = inject(AuthService);

  constructor() {
    this.auth.refreshMe().subscribe();
  }
}
