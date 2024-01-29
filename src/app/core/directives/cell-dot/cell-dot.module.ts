import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellDotDirective } from './cell-dot.directive';



@NgModule({
  declarations: [
    CellDotDirective
  ],
  exports: [
    CellDotDirective
  ],
  imports: [
    CommonModule
  ]
})
export class CellDotModule { }
