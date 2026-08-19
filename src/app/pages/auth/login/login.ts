import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/firebase-config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="fixed inset-0 bg-cover bg-center z-0" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBushbbRc-z3D2Ipz8noEyhGhX4Mx4c-gwwRx3cGmV8gQMlF6qN3Es1Oqd39bsB7kul-g9nnBGYYeC_253ykd31z4FlFHjA-5GFLQauWasQTwfjPTUVuHGNDpyuIQXkmC3Qt9dGEKvZN8xiDiRW3yEaEHcf1Xn-soJsKRp2yukgENADJK2Si1YEi1Hr1gPobH1nknURnP-rpwdvb9nWBf92OLa035zB-02TSFf1r4GGBDfFBBx8LlwNZ7879ulPNk93Jg')"></div>
<div class="fixed inset-0 bg-inverse-surface/70 backdrop-blur-md z-0"></div>
<main class="relative z-10 flex min-h-screen items-center justify-center p-margin-mobile md:p-margin-desktop">
  <div class="fade-in-up w-full max-w-[420px] rounded-xl bg-surface-container-lowest/90 p-xl shadow-2xl backdrop-blur-xl border border-surface-variant">
    <div class="mb-lg flex flex-col items-center justify-center text-center">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm mb-sm">
        <span class="material-symbols-outlined text-[32px]">domain</span>
      </div>
      <h1 class="font-headline-md text-headline-md text-on-surface">Hotel Gran Vista</h1>
      <p class="font-body-md text-body-md text-on-surface-variant mt-xs">Portal de Gestión Corporativa</p>
    </div>

    <!-- Error Alert -->
    <div *ngIf="loginError" class="mb-4 bg-error-container border border-error/20 text-on-error-container text-xs p-3 rounded-lg flex items-center gap-2 animate-fade-in">
      <span class="material-symbols-outlined text-[18px]">error</span>
      <span>{{ errorMessage }}</span>
    </div>

    <form class="flex flex-col gap-md" (ngSubmit)="login()">
      <div class="flex flex-col gap-xs">
        <label class="font-label-sm text-label-sm text-on-surface" for="email">Correo electrónico</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">mail</span>
          <input 
            class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-sm pl-xl pr-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
            id="email" 
            name="email"
            [(ngModel)]="email"
            placeholder="nombre@hotelgranvista.com" 
            type="email"
            required
          />
        </div>
      </div>
      
      <div class="flex flex-col gap-xs">
        <label class="font-label-sm text-label-sm text-on-surface" for="password">Contraseña</label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">lock</span>
          <input 
            class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-sm pl-xl pr-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" 
            id="password" 
            name="password"
            [(ngModel)]="password"
            placeholder="••••••••" 
            type="password"
            required
          />
        </div>
      </div>
      
      <div class="flex items-center justify-between mt-xs mb-sm">
        <label class="flex items-center gap-sm cursor-pointer group">
          <input 
            class="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest cursor-pointer" 
            type="checkbox"
            name="remember"
            [(ngModel)]="rememberMe"
          />
          <span class="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Recordarme</span>
        </label>
        <a class="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant transition-colors" href="#">¿Olvidaste tu contraseña?</a>
      </div>
      
      <button class="w-full rounded-lg bg-primary px-lg py-[10px] font-label-sm text-label-sm text-on-primary shadow-sm transition-all hover:bg-on-primary-fixed-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface hover:-translate-y-[1px]" type="submit">
        Iniciar Sesión
      </button>
    </form>
  </div>
</main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      width: 100%;
      
      /* Color overrides for Hotel Gran Vista */
      --color-primary: #005d90;
      --color-secondary: #2c694e;
      --color-background: #f9f9ff;
      --color-on-background: #111c2d;
      --color-surface-container-lowest: #ffffff;
      --color-outline-variant: #bfc7d1;
      --color-inverse-surface: #263143;
      --color-surface-variant: #d8e3fb;
      --color-on-surface: #111c2d;
      --color-on-surface-variant: #404850;
      --color-primary-container: #0077b6;
      --color-on-primary-container: #f3f7ff;
      --color-on-primary: #ffffff;
      --color-on-primary-fixed-variant: #004b74;
      --color-error-container: #ffdad6;
      --color-on-error-container: #93000a;
      --color-error: #ba1a1a;
      
      /* border-radius overrides */
      --radius-lg: 0.25rem;
      --radius-xl: 0.5rem;
      --radius-full: 0.75rem;
      
      /* spacing overrides */
      --spacing-sm: 8px;
      --spacing-md: 16px;
      --spacing-margin-mobile: 16px;
      --spacing-xs: 4px;
      --spacing-gutter: 24px;
      --spacing-xl: 40px;
      --spacing-margin-desktop: 32px;
      --spacing-lg: 24px;
      --spacing-base: 4px;

      /* font overrides */
      --font-label-sm: "Inter", sans-serif;
      --font-display-lg: "Inter", sans-serif;
      --font-title-lg: "Inter", sans-serif;
      --font-body-md: "Inter", sans-serif;
      --font-headline-lg: "Inter", sans-serif;
      --font-headline-md: "Inter", sans-serif;
      --font-body-lg: "Inter", sans-serif;

      /* text styles */
      --text-label-sm: 12px;
      --text-label-sm--line-height: 16px;
      --text-label-sm--letter-spacing: 0.05em;
      --text-label-sm--font-weight: 600;

      --text-display-lg: 48px;
      --text-display-lg--line-height: 56px;
      --text-display-lg--letter-spacing: -0.02em;
      --text-display-lg--font-weight: 700;

      --text-title-lg: 20px;
      --text-title-lg--line-height: 28px;
      --text-title-lg--font-weight: 500;

      --text-body-md: 14px;
      --text-body-md--line-height: 20px;
      --text-body-md--font-weight: 400;

      --text-headline-lg: 32px;
      --text-headline-lg--line-height: 40px;
      --text-headline-lg--letter-spacing: -0.01em;
      --text-headline-lg--font-weight: 600;

      --text-headline-md: 24px;
      --text-headline-md--line-height: 32px;
      --text-headline-md--font-weight: 600;

      --text-body-lg: 16px;
      --text-body-lg--line-height: 24px;
      --text-body-lg--font-weight: 400;
    }

    .fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class Login {
  email = '';
  password = '';
  loginError = false;
  showPassword = false;
  isLoading = false;
  errorMessage = 'Usuario o contraseña incorrectos.';
  rememberMe = false;

  showForgotForm = false;
  recoveryEmail = '';
  recoverySuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  toggleForgotForm(show: boolean) {
    this.showForgotForm = show;
    this.loginError = false;
    this.errorMessage = '';
    this.recoverySuccess = false;
    this.recoveryEmail = this.email;
  }

  async sendRecoveryEmail() {
    if (this.isLoading) return;

    if (!this.recoveryEmail || !this.recoveryEmail.includes('@')) {
      this.errorMessage = 'Por favor, ingrese un correo electrónico válido.';
      this.loginError = true;
      return;
    }

    this.isLoading = true;
    this.loginError = false;
    this.recoverySuccess = false;

    try {
      await sendPasswordResetEmail(auth, this.recoveryEmail);
      this.recoverySuccess = true;
    } catch (error: any) {
      console.error('Recovery error:', error);
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No existe un usuario registrado con este correo.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El formato del correo no es válido.';
      } else {
        this.errorMessage = 'Ocurrió un error al enviar el correo. Intente más tarde.';
      }
      this.loginError = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async login() {
    let loginEmail = this.email.trim();
    if (!loginEmail) {
      this.errorMessage = 'Por favor, ingrese su usuario.';
      this.loginError = true;
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Por favor, ingrese su contraseña.';
      this.loginError = true;
      return;
    }

    this.loginError = false;
    this.errorMessage = 'Usuario o contraseña incorrectos.';

    // Hardcode logic for Hotel Gran Vista Admin
    if (loginEmail === 'admin@gmail.com' && this.password === 'admin123') {
      try {
        localStorage.setItem('dapper_session', 'true');
        localStorage.setItem('hardcoded_session', 'true');
        
        this.authService.userProfile.set({
          name: 'Administrador',
          email: 'admin@gmail.com',
          role: 'Administrador',
          jobPosition: 'Administrador',
          jobArea: 'Administración',
          phone: 0
        });
        this.authService.isProfileLoaded.set(true);
        this.authService.needsHeavyLoader.set(false);

        // Instant redirect without delay or animations
        this.router.navigate(['/Inicio/GestionHabitaciones']);
      } catch (err) {
        console.error('Hardcoded login error:', err);
        this.errorMessage = 'Ocurrió un error al iniciar sesión.';
        this.loginError = true;
      }
      return;
    }

    // Default Firebase authentication path fallback
    if (!loginEmail.includes('@')) {
      loginEmail = `${loginEmail}@negociosadlb.com`;
    }

    try {
      this.isLoading = true;
      const result = await this.authService.login(loginEmail, this.password);

      if (!result.success) {
        switch (result.errorCode) {
          case 'auth/invalid-email':
            this.errorMessage = 'El correo electrónico ingresado no es válido.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            this.errorMessage = 'Usuario o contraseña incorrectos.';
            break;
          case 'auth/too-many-requests':
            this.errorMessage = 'Demasiados intentos fallidos. Su cuenta ha sido bloqueada temporalmente.';
            break;
          case 'auth/network-request-failed':
            this.errorMessage = 'Error de conexión. Verifique su internet.';
            break;
          default:
            this.errorMessage = 'Error al iniciar sesión. Intente de nuevo.';
            break;
        }
        this.loginError = true;
      }
    } catch (err) {
      console.error('Error inesperado en el componente Login:', err);
      this.errorMessage = 'Ocurrió un error inesperado. Intente de nuevo.';
      this.loginError = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
