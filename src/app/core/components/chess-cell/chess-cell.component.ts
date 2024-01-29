import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-chess-cell',
  standalone: true,
  imports: [CommonModule, CellColorModule, PawnComponent, RookComponent, KnightComponent, BishopComponent, QueenComponent, KingComponent, CellDotModule],
  templateUrl: './chess-cell.component.html',
  styleUrls: ['./chess-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChessCellComponent {
  @Input() color!: Colors

  @Input() figure!: Partial<FigureInfo> | null

  @Input() figureInfo!: { figure: Partial<FigureInfo> | null, active?: boolean }

  @Input() coords!: ICoordinates

  constructor(
    private boardService: ChessBoardService,
    private chooseService: ChooseElementService,
    private bitBoardService: BitBoardService
  ) {
  }

  getActiveStatus() {
    return Boolean(this.figureInfo.active)
  }

  move() {

    let currentCell = this.boardService.board[this.coords.i][this.coords.j]
    if(this.getActiveStatus()) {
      this.chooseService.choose$.pipe(first()).subscribe(figure => {
        if(figure?.color! === Colors.WHITE) {
          if(this.bitBoardService.checkForChecksForWhite()) {
            console.log("here") //сюда попадаем и поэтому не ходим
            return
          }
        } else {
          if(this.bitBoardService.checkForChecksForBlack()) {
            return
          }
        }
        this.bitBoardService.clearWhiteBitBoard()
        let figureCoords = this.boardService.getCoordinatesById(figure!.id)
        this.boardService.board[this.coords.i][this.coords.j] = {...this.boardService.board[figureCoords.i][figureCoords.j]}
        this.boardService.board[figureCoords.i][figureCoords.j] = {...currentCell}
        this.boardService.hideAllDots();
        this.bitBoardService.triggerMove(figure?.color!, figure?.id!)
        if(figure?.color! === Colors.WHITE) {
        } else {
        }
      })
    }
  }

}
