import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GnuiModule } from "./modules/gnui.module";
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GnuiModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
