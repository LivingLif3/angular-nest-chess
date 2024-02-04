import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnInit, Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, ICoordinates} from "../../../../core/types/cell-type";
import {CellColorModule} from "../../../../core/directives/cell-color/cell-color.module";
import {FigureInfo} from "../../../../core/types/figure-info";
import {PawnComponent} from "../pawn/pawn.component";
import {RookComponent} from "../rook/rook.component";
import {KnightComponent} from "../knight/knight.component";
import {BishopComponent} from "../bishop/bishop.component";
import {QueenComponent} from "../queen/queen.component";
import {KingComponent} from "../king/king.component";
import {CellDotModule} from "../../../../core/directives/cell-dot/cell-dot.module";
import {ChessBoardService} from "../../../../core/services/chess-board.service";
import {ChooseElementService} from "../../../../core/services/choose-element.service";
import {first} from "rxjs";
import {BitBoardService} from "../../../../core/services/bit-board.service";
import {FiguresType} from "../../../../core/types/figures-type";
import {CastlingService} from "../../../../core/services/castling.service";
import {CellAttackCircleModule} from "../../../../core/directives/cell-attack-circle/cell-attack-circle.module";
import {AbstractFigureDirective} from "../../../../core/directives/abstract-figure/abstract-figure.directive";

@Component({
  selector: 'app-chess-cell',
  standalone: true,
  imports: [CommonModule, CellColorModule, PawnComponent, RookComponent, KnightComponent, BishopComponent, QueenComponent, KingComponent, CellDotModule, CellAttackCircleModule],
  templateUrl: './chess-cell.component.html',
  styleUrls: ['./chess-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChessCellComponent implements AfterViewInit {
  @Input() color!: Colors

  @Input() figure!: Partial<FigureInfo> | null

  @Input() figureInfo!: { figure: Partial<FigureInfo> | null, active?: boolean, attack?: boolean }

  @Input() coords!: ICoordinates

  @ViewChild('renderedFigure', { read: ViewContainerRef })
  renderedFigure!: ViewContainerRef

  renderFigures: Record<FiguresType, Type<AbstractFigureDirective>> = {
    [FiguresType.PAWN]: PawnComponent,
    [FiguresType.KNIGHT]: KnightComponent,
    [FiguresType.BISHOP]: BishopComponent,
    [FiguresType.QUEEN]: QueenComponent,
    [FiguresType.KING]: KingComponent,
    [FiguresType.ROOK]: RookComponent
  }

  constructor(
    private boardService: ChessBoardService,
    private chooseService: ChooseElementService,
    private bitBoardService: BitBoardService,
    private castlingService: CastlingService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit() {
    if (this.figure) {
      this.createFigure()
      this.ref.detectChanges()
    }
  }

  createFigure() {
    this.renderedFigure.clear()
    const componentRef = this.renderedFigure.createComponent<AbstractFigureDirective>(this.renderFigures[this.figure!.type!])
    componentRef.instance['color'] = this.figure!.color!
    componentRef.instance['figure'] = this.figure!
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
