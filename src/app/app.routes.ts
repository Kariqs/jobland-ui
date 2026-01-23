import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { Features } from './pages/features/features';
import { Signup } from './pages/auth/signup/signup';
import { Login } from './pages/auth/login/login';
import { authGuard } from './services/guards/auth-guard';
import { AccountActivationComponent } from './pages/auth/activate/activate';
import { JobTeaserComponent } from './pages/teaser-dashboard/teaser-dashboard';

export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'activate', component: AccountActivationComponent },
  { path: '', component: Home },
  { path: 'jobs', component: JobTeaserComponent },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'features', component: Features },
];
