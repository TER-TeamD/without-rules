import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayCardsComponent } from './display-cards/display-cards.component';
import { EndPageComponent } from './end-page/end-page.component';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TableCardsComponent } from './table-cards/table-cards.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent
  },
  {
    path: "cards",
    component: DisplayCardsComponent
  },
  {
    path: "table",
    component: TableCardsComponent
  },
  {
    path: "loading",
    component: LoadingPageComponent
  },
  {
    path: "end",
    component: EndPageComponent
  },
  {
    path: "**",
    redirectTo: "/"
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
