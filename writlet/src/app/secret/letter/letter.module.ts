import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from "@angular/router";
import { FormsModule } from '@angular/forms';
import {LetterComponent} from "./letter/letter.component";

const letterRoutes:Routes = [
  { path: '', component:LetterComponent },
]

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(letterRoutes),
    FormsModule
  ]
})
export class LetterModule { }
