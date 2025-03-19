import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComplaintsComponent } from './app/components/dashboard/complaints/complaints.component';
import { routes } from './app/app.routes';

bootstrapApplication(ComplaintsComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
