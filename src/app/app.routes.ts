import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { Features } from './pages/features/features';
import { Signup } from './pages/auth/signup/signup';

export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: '', component: Home },
  { path: 'dashboard', component: Dashboard },
  { path: 'features', component: Features },
];
