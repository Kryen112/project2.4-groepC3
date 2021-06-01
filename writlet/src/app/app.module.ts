import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderModule } from "./header/header.module";
import { FooterModule } from "./footer/footer.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { LetterComponent } from "./secret/letter/letter/letter.component";
import { HttpClientModule } from '@angular/common/http';
import { ViewComponent } from './secret/view/view.component';

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
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
