import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LetterComponent } from './letter/letter.component';
import { FormsModule } from '@angular/forms';
import { LetterboxComponent } from './letterbox/letterbox.component';
import { PenpalsComponent } from './penpals/penpals.component';
import { UserComponent } from './user/user.component';
import { ReadComponent } from './read/read.component';

const secretRoutes: Routes = [
    { path: '', redirectTo: 'letter' },
    { path: 'letter', component: LetterComponent },
    { path: 'letterbox', component: LetterboxComponent },
    { path: 'penpals', component: PenpalsComponent },
    { path: 'user', component: UserComponent },
    { path: 'read/:id', component: ReadComponent}
]

@NgModule({
  declarations: [
    ReadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(secretRoutes),
    FormsModule
  ]
})
export class SecretModule { }
