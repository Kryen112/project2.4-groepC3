import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderModule } from "./header/header.module";
import { FooterModule } from "./footer/footer.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { LetterComponent } from "./secret/letter/letter/letter.component";
import { HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './about/about.component';
import { TermsconditionsComponent } from './termsconditions/termsconditions.component';
import { ContactComponent } from './contact/contact.component';
import { HelpComponent } from './help/help.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RegisterComponent } from './register/register.component';
import { LetterboxComponent } from "./secret/letterbox/letterbox.component";
import { PenpalsComponent } from "./secret/penpals/penpals.component";
import { UserComponent } from "./secret/user/user.component";
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LetterComponent,
    AboutComponent,
    TermsconditionsComponent,
    ContactComponent,
    HelpComponent,
    RegisterComponent,
    LetterboxComponent,
    PenpalsComponent,
    UserComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HeaderModule,
    FooterModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:3000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
