import {Injectable} from '@angular/core';
import {FiguresType} from "../types/figures-type";
import {Colors, ICoordinates} from "../types/cell-type";
import {CreateFigureService} from "./create-figure.service";

@Injectable({
  providedIn: 'root'
})
export class ChessBoardService {

  board = [
    [
      {
        figure: this.createFigure.createFigure(FiguresType.ROOK, Colors.WHITE)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.KNIGHT, Colors.WHITE)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.BISHOP, Colors.WHITE)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.QUEEN, Colors.WHITE)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.KING, Colors.WHITE)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.BISHOP, Colors.WHITE)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.KNIGHT, Colors.WHITE)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.ROOK, Colors.WHITE)
      },
    ], // 1
    Array(8).fill(0).map(el => ({
      figure: this.createFigure.createFigure(FiguresType.PAWN, Colors.WHITE),
      firstMove: true
    })), // 2
    Array(8).fill({
      figure: null,
      active: false
    }), // 3
    Array(8).fill({
      figure: null,
      active: false
    }), // 4
    Array(8).fill({
      figure: null,
      active: false
    }), // 5
    Array(8).fill({
      figure: null,
      active: false
    }), // 6
    Array(8).fill(0).map(el => ({
      figure: this.createFigure.createFigure(FiguresType.PAWN, Colors.BLACK),
      firstMove: true
    })), // 7
    [
      {
        figure: this.createFigure.createFigure(FiguresType.ROOK, Colors.BLACK)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.KNIGHT, Colors.BLACK)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.BISHOP, Colors.BLACK)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.QUEEN, Colors.BLACK)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.KING, Colors.BLACK)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.BISHOP, Colors.BLACK)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.KNIGHT, Colors.BLACK)
      },
      {
        figure: this.createFigure.createFigure(FiguresType.ROOK, Colors.BLACK)
      }
    ] // 8
  ]

  constructor(private createFigure: CreateFigureService) {
  }

  getCoordinatesById(id: number): ICoordinates {
    return {
      i: Math.floor(id / 10),
      j: id % 10
    }
  }

  hideAllDots() {
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 8; j++) {
        if(!this.board[i][j].figure && this.board[i][j].active) {
          this.board[i][j] = { ...this.board[i][j], active: false };
        }
      }
    }
  }

  getWhiteKingCoords(): ICoordinates {
    let coordinates: ICoordinates
    for(let i = 0; i < 8; i++) {
      let j = this.board[i].findIndex(el => el.figure?.type === FiguresType.KING && el.figure?.color === Colors.WHITE)
      console.log(this.board[i], j)
      if(j !== -1) {
        coordinates = {
          i,
          j
        }
      }
    }
    return coordinates!
  }

  getBlackKingCoords(): ICoordinates {
    let coordinates: ICoordinates
    for(let i = 0; i < 8; i++) {
      let j = this.board[i].findIndex(el => el.figure?.type === FiguresType.KING && el.figure?.color === Colors.BLACK)
      console.log(this.board[i], j)
      if(j !== -1) {
        coordinates = {
          i,
          j
        }
      }
    }
    return coordinates!
  }
}
