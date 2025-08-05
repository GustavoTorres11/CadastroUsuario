import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import {
  provideHttpClient,
  withFetch,
  withInterceptors
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth/auth.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import 'zone.js';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(), // Para SSR
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes)
  ],
}).catch(err => {
  console.error('Erro ao inicializar aplicação:', err);
});