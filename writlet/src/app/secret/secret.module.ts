import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SecretComponent } from './secret/secret.component';
import { LetterComponent } from './letter/letter/letter.component';
import { FormsModule } from '@angular/forms';
import { ViewComponent } from './view/view.component';
import { LetterboxComponent } from './letterbox/letterbox.component';
import { PenpalsComponent } from './penpals/penpals.component';
import { UserComponent } from './user/user.component';
import { ReadComponent } from './read/read.component';

const secretRoutes: Routes = [
    { path: '', redirectTo: 'letter' },
    { path: 'letter', component: LetterComponent },
    { path: 'view', component: ViewComponent },
    { path: 'letterbox', component: LetterboxComponent },
    { path: 'penpals', component: PenpalsComponent },
    { path: 'user', component: UserComponent },
    { path: 'read/:id', component: ReadComponent}
]

@NgModule({
  declarations: [
    SecretComponent,
    ReadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(secretRoutes),
    FormsModule
  ]
})
export class SecretModule { }
