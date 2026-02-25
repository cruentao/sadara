import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h1>SADARA</h1>
      <h2>Iniciar sesión</h2>
      <form (ngSubmit)="onSubmit()">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          [(ngModel)]="email"
          name="email"
          required
          autocomplete="email"
        />
        <label for="password">Contraseña</label>
        <input
          id="password"
          type="password"
          [(ngModel)]="password"
          name="password"
          required
          autocomplete="current-password"
        />
        @if (errorMessage()) {
          <p class="error">{{ errorMessage() }}</p>
        }
        <button type="submit" [disabled]="loading()">
          {{ loading() ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 10vh auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }
    form { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
    input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
    button { padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .error { color: #dc2626; font-size: 0.875rem; }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Generic message — never expose internal backend errors to the user
        this.errorMessage.set('Credenciales incorrectas. Verifica tu email y contraseña.');
        this.loading.set(false);
      },
    });
  }
}
