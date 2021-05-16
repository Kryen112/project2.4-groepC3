import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HeaderModule} from "./header/header.module";
import {FooterModule} from "./footer/footer.module";
import { LetterComponent } from './letter/letter.component';
import {FormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    AppComponent,
    LetterComponent,
    ViewComponent
  ],
  imports: [
    BrowserModule,
    HeaderModule,
    FooterModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
