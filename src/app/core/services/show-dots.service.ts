import { Injectable } from '@angular/core';
import {ChessBoardService} from "./chess-board.service";
import {Colors, ICoordinates} from "../types/cell-type";

@Injectable({
  providedIn: 'root'
})
export class ShowDotsService {

  constructor(
    private boardService: ChessBoardService
  ) { }

  showVerticalDots(count: number, coordinates: ICoordinates) {
    let {i, j} = coordinates
    if(this.boardService.board[i][j].figure.color === Colors.WHITE) {
      for(i = i + 1; i <= coordinates.i + count; i++) {
        console.log(i)
        if(!this.boardService.board[i][j].figure) {
          this.boardService.board[i][j] = {...this.boardService.board[i][j], active: true}
          console.log('MAKED')
        }
      }
    } else {
      for(i = i - 1; i >= coordinates.i - count; i--) {
        if(!this.boardService.board[i][j].figure) {
          this.boardService.board[i][j] = {...this.boardService.board[i][j], active: true}
        }
      }
    }
  }

  hideVerticalDots(count: number, coordinates: ICoordinates) {
    console.log('HERE')
    let {i, j} = coordinates
    if(this.boardService.board[i][j].figure.color === Colors.WHITE) {
      for(i = i + 1; i <= coordinates.i + count; i++) {
        if(!this.boardService.board[i][j].figure) {
          this.boardService.board[i][j] = {...this.boardService.board[i][j], active: false}
        }
      }
    } else {
      for(i = i - 1; i >= coordinates.i - count; i--) {
        if(!this.boardService.board[i][j].figure) {
          this.boardService.board[i][j] = {...this.boardService.board[i][j], active: false}
        }
      }
    }
    this.boardService.board = [...this.boardService.board]
  }
}
