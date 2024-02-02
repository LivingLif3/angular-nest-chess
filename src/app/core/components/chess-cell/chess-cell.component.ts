import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, ICoordinates} from "../../types/cell-type";
import {CellColorModule} from "../../directives/cell-color/cell-color.module";
import {FigureInfo} from "../../types/figure-info";
import {PawnComponent} from "../pawn/pawn.component";
import {RookComponent} from "../rook/rook.component";
import {KnightComponent} from "../knight/knight.component";
import {BishopComponent} from "../bishop/bishop.component";
import {QueenComponent} from "../queen/queen.component";
import {KingComponent} from "../king/king.component";
import {CellDotModule} from "../../directives/cell-dot/cell-dot.module";
import {ChessBoardService} from "../../services/chess-board.service";
import {ChooseElementService} from "../../services/choose-element.service";
import {first} from "rxjs";
import {BitBoardService} from "../../services/bit-board.service";
import {FiguresType} from "../../types/figures-type";
import {CastlingService} from "../../services/castling.service";
import {CellAttackCircleModule} from "../../directives/cell-attack-circle/cell-attack-circle.module";

@Component({
  selector: 'app-chess-cell',
  standalone: true,
  imports: [CommonModule, CellColorModule, PawnComponent, RookComponent, KnightComponent, BishopComponent, QueenComponent, KingComponent, CellDotModule, CellAttackCircleModule],
  templateUrl: './chess-cell.component.html',
  styleUrls: ['./chess-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChessCellComponent {
  @Input() color!: Colors

  @Input() figure!: Partial<FigureInfo> | null

  @Input() figureInfo!: { figure: Partial<FigureInfo> | null, active?: boolean, attack?: boolean }

  @Input() coords!: ICoordinates

  constructor(
    private boardService: ChessBoardService,
    private chooseService: ChooseElementService,
    private bitBoardService: BitBoardService,
    private castlingService: CastlingService
  ) {
  }

  getActiveStatus() {
    return Boolean(this.figureInfo.active)
  }

  getAttackStatus() {
    return Boolean(this.figureInfo.attack)
  }

  move() {
    let currentCell = this.boardService.board[this.coords.i][this.coords.j]
    if(this.getActiveStatus()) {
      this.chooseService.choose$.pipe(first()).subscribe(figure => {
        // if(figure?.color! === Colors.WHITE) {
        //   if(this.bitBoardService.checkForChecksForWhite(this.boardService.board)) {
        //     // console.log("here") //сюда попадаем и поэтому не ходим
        //   }
        // } else {
        //   if(this.bitBoardService.checkForChecksForBlack(this.boardService.board)) {
        //
        //   }
        // }
        if(!this.canMakeMove(currentCell, figure!, figure?.color!)) {
          return
        }
        if(figure!.type === FiguresType.KING &&
            this.castlingService.kingsCastling[figure?.color! + this.coords.i + this.coords.j] !== undefined
            && this.castlingService.kingsCastling[figure?.color! + this.coords.i + this.coords.j]()) {
          const cell = this.castlingService.castlingCells[figure?.color!].findIndex(el =>
              (el.king.i === this.coords.i && el.king.j === this.coords.j))
          if(cell !== -1) {
            let figureCoords = this.boardService.getCoordinatesById(figure!.id)
            let kingCoords = this.boardService.kingCoordinates[figure?.color!](this.boardService.board)
            this.boardService.board[this.coords.i][this.coords.j] = {
              ...this.boardService.board[kingCoords.i][kingCoords.j]
            }
            this.boardService.board[figureCoords.i][figureCoords.j] = {
              figure: null,
              active: false
            }
            this.boardService.board[this.castlingService.castlingCells[figure?.color!][cell].rook.i][this.castlingService.castlingCells[figure?.color!][cell].rook.j] = {
              ...this.boardService.board[this.castlingService.castlingCells[figure?.color!][cell].rook.startCoords.i][this.castlingService.castlingCells[figure?.color!][cell].rook.startCoords.j]
            }
            this.boardService.board[this.castlingService.castlingCells[figure?.color!][cell].rook.startCoords.i][this.castlingService.castlingCells[figure?.color!][cell].rook.startCoords.j] = {
              figure: null,
              active: false
            }
            this.boardService.hideAllDots();
            this.boardService.hideAllAttackCircles();
            this.bitBoardService.triggerMove(figure?.color!, figure?.id!)
            return
          }
        }
        // this.bitBoardService.clearWhiteBitBoard()
        let figureCoords = this.boardService.getCoordinatesById(figure!.id)
        console.log(figure)
        console.log(currentCell)
        this.boardService.board[this.coords.i][this.coords.j] = {...this.boardService.board[figureCoords.i][figureCoords.j]}
        this.boardService.board[figureCoords.i][figureCoords.j] = {...currentCell}
        this.boardService.hideAllDots();
        this.boardService.hideAllAttackCircles();
        this.bitBoardService.triggerMove(figure?.color!, figure?.id!)
      })
    } else if (this.getAttackStatus()) {
      this.chooseService.choose$.pipe(first()).subscribe(figure => {
        if(!this.canMakeMove(currentCell, figure!, figure?.color!)) {
          return
        }
        let figureCoords = this.boardService.getCoordinatesById(figure!.id)
        console.log(figure)
        console.log(currentCell)
        this.boardService.board[this.coords.i][this.coords.j] = {...this.boardService.board[figureCoords.i][figureCoords.j]}
        this.boardService.board[figureCoords.i][figureCoords.j] = {
          figure: null,
          active: false
        }
        this.boardService.hideAllDots();
        this.boardService.hideAllAttackCircles();
        this.bitBoardService.triggerMove(figure?.color!, figure?.id!)
      })
    }
  }

  canMakeMove(currentCell: any, figure: Partial<FigureInfo>, color: Colors) {
    this.bitBoardService.clearCheckBitBoard()
    let copyOfBoard: any = []
    for(let i = 0; i < 8; i++) {
      copyOfBoard = [...copyOfBoard, [...this.boardService.board[i]]]
    }
    let figureCoords = this.boardService.getCoordinatesById(figure!.id!)
    copyOfBoard[this.coords.i][this.coords.j] = {...copyOfBoard[figureCoords.i][figureCoords.j]}
    copyOfBoard[figureCoords.i][figureCoords.j] = {...currentCell}
    this.bitBoardService.triggerCheckMove(copyOfBoard, figure?.color! === Colors.WHITE ? Colors.BLACK : Colors.WHITE, figure?.id!)
    if(color === Colors.BLACK) {
      if(this.bitBoardService.checkForPredictedMoveChecksForBlack(copyOfBoard)) {
        return false
      }
    } else {
      if(this.bitBoardService.checkForPredictedMoveChecksForWhite(copyOfBoard)) {
        return false
      }
    }
    return true
  }

}
