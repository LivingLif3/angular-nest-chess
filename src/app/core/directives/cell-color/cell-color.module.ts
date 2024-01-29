import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CellColorDirective} from "./cell-color.directive";



@NgModule({
  declarations: [CellColorDirective],
  imports: [
    CommonModule
  ],
  exports: [
    CellColorDirective
  ]
})
export class CellColorModule { }
