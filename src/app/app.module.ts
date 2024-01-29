import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {ChessBoardComponent} from "./core/components/chess-board/chess-board.component";
import { CellColorDirective } from './core/directives/cell-color/cell-color.directive';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ChessBoardComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
