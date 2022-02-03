import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main-frame/header/header.component';
import { SidebarComponent } from './main-frame/sidebar/sidebar.component';
import { MainFrameComponent } from './main-frame/main-frame.component';
import { HamburgerComponent } from './main-frame/hamburger/hamburger.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    MainFrameComponent,
    HamburgerComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
