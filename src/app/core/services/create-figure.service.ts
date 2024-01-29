import { Injectable } from '@angular/core';
import {FiguresType} from "../types/figures-type";
import {Colors} from "../types/cell-type";
import {FigureInfo} from "../types/figure-info";

@Injectable({
  providedIn: 'root'
})
export class CreateFigureService {

  constructor() { }

  createFigure(type: FiguresType, color: Colors): Partial<FigureInfo> {
    return {
      type,
      color
    }
  }
}
