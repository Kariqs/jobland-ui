import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { Features } from './pages/features/features';
import { Signup } from './pages/auth/signup/signup';
import { Login } from './pages/auth/login/login';
import { authGuard } from './services/guards/auth-guard';

export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: '', component: Home },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'features', component: Features },
];
