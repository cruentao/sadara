import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Panel de Control</h1>
      @if (authService.currentUser(); as user) {
        <p>Bienvenido, <strong>{{ user.email }}</strong></p>
        <p>Rol: <strong>{{ user.role }}</strong></p>
      }
      <p class="placeholder">El contenido del dashboard se implementará en un paso posterior.</p>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; }
    .placeholder { margin-top: 2rem; color: #6b7280; }
  `],
})
export class DashboardComponent {
  constructor(readonly authService: AuthService) {}
}
