import {Injectable} from '@angular/core';
import {Colors} from "../types/cell-type";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  color: Colors = Colors.WHITE

  constructor() { }

  get enemyColor() {
    return this.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
  }

}
