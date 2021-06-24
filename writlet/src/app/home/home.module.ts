import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes} from '@angular/router';
import { RegisterComponent } from "../register/register.component";

const loginRoutes:Routes = [
  { path: '', component:HomeComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'login',
    loadChildren: () => import('../login/login.module').then(m => m.LoginModule)
  },
]

@NgModule({
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(loginRoutes)
  ]
})
export class HomeModule { }
