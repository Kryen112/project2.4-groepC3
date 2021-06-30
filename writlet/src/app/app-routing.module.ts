import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuardService as guard } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service'
import { AboutComponent } from "./about/about.component";
import { TermsconditionsComponent } from "./termsconditions/termsconditions.component";
import { ContactComponent } from "./contact/contact.component";
import { HelpComponent } from "./help/help.component";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'termsconditions', component: TermsconditionsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'help', component: HelpComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'secret',
    loadChildren: () => import('./secret/secret.module').then(m => m.SecretModule), canActivate: [guard]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  providers: [ guard, AuthService ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
