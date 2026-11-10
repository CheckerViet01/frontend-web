import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { GoogleLoginComponent } from './pages/google-login/google-login.component';
import { GoogleCallbackComponent } from './pages/google-callback/google-callback.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'google-callback', component: GoogleCallbackComponent },
  { path: 'google-login', component: GoogleLoginComponent },
  { path: 'admin-portal', component: AdminLoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
