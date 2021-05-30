import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes} from '@angular/router';

const loginRoutes:Routes = [
  { path: '', component:HomeComponent },
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
    RouterModule.forChild(loginRoutes)
  ]
})
export class HomeModule { }
