import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SecretComponent } from './secret/secret.component';
import { LetterComponent } from './letter/letter/letter.component';
import { FormsModule } from '@angular/forms';

const secretRoutes:Routes = [
  { path: '', component: SecretComponent, children: [
      { path: '', redirectTo: 'letter' },
      { path: '/letter', component: LetterComponent }
  ] }
]

@NgModule({
  declarations: [
    SecretComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(secretRoutes)
  ]
})
export class SecretModule { }
