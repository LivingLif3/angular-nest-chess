import {FiguresType} from "./figures-type";
import {Colors} from "./cell-type";

export interface FigureInfo {
  type: FiguresType,
  color: Colors,
  id: number
}
