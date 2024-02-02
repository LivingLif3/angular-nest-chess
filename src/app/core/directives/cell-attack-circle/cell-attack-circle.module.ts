import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CellAttackCircleDirective} from "./cell-attack-circle.directive";



@NgModule({
  declarations: [CellAttackCircleDirective],
  imports: [
    CommonModule
  ],
  exports: [CellAttackCircleDirective]
})
export class CellAttackCircleModule { }
