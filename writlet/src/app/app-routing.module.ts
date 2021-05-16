import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LetterComponent} from "./letter/letter.component";
import { ViewComponent} from "./view/view.component";

const routes: Routes = [
  { path: 'letter', component: LetterComponent},
  { path : 'view', component: ViewComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
