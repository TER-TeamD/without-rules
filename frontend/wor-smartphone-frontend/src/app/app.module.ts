import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayCardsComponent } from './display-cards/display-cards.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CardComponent } from './card/card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { InfoBarComponent } from './info-bar/info-bar.component';
import { TableCardsComponent } from './table-cards/table-cards.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayCardsComponent,
    LoginPageComponent,
    CardComponent,
    InfoBarComponent,
    TableCardsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
