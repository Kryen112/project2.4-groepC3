import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderModule } from "./header/header.module";
import { FooterModule } from "./footer/footer.module";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { ViewComponent } from './view/view.component';
import { LoginComponent } from './login/login/login.component';
import { HomeComponent } from './home/home/home.component';
import {LetterComponent} from "./secret/letter/letter/letter.component";

@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    LoginComponent,
    HomeComponent,
    LetterComponent
  ],
  imports: [
    BrowserModule,
    HeaderModule,
    FooterModule,
    FormsModule,
    AppRoutingModule,
    FormGroup,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
