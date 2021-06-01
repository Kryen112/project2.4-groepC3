import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SecretComponent } from './secret/secret.component';
import { LetterComponent } from './letter/letter/letter.component';
import { FormsModule } from '@angular/forms';
import { ViewComponent } from './view/view.component';

const secretRoutes:Routes = [
    { path: '', redirectTo: 'letter' },
    { path: 'letter', component: LetterComponent },
    { path: 'view', component: ViewComponent }
]

@NgModule({
  declarations: [
    SecretComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(secretRoutes),
    FormsModule
  ]
})
export class SecretModule { }
