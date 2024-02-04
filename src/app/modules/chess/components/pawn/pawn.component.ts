import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, OnDestroy,
  OnInit,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, ICoordinates} from "../../../../core/types/cell-type";
import {FiguresType} from "../../../../core/types/figures-type";
import {ChessBoardService} from "../../../../core/services/chess-board.service";
import {ChooseElementService} from "../../../../core/services/choose-element.service";
import {filter, Subject, takeUntil} from "rxjs";
import {BitBoardService} from "../../../../core/services/bit-board.service";
import {AbstractFigureDirective} from "../../../../core/directives/abstract-figure/abstract-figure.directive";

@Component({
  selector: 'app-pawn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pawn.component.html',
  styleUrls: ['./pawn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PawnComponent extends AbstractFigureDirective implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  firstMove: boolean = true

  startCoordinateY!: Number;

  constructor(
    private boardService: ChessBoardService,
    private chooseService: ChooseElementService,
    private bitBoardService: BitBoardService,
  ) {
    super(boardService, chooseService, bitBoardService)
  }

  ngOnInit() {
    this.startCoordinateY = this.color === Colors.WHITE ? 1 : 6;
    this.imgPath = `${this.color + FiguresType.PAWN}.png`

    this.chooseService.choose$.subscribe(figure => {
      let coordinates = this.boardService.getCoordinatesById(this.figure.id!);
      if(figure?.id === this.figure.id) {
        this.boardService.hideAllDots()
        this.boardService.hideAllAttackCircles()
        if(coordinates.i !== this.startCoordinateY) {
          this.firstMove = false;
        }
        if(this.firstMove) {
         this.showDots(2)
        } else {
          this.showDots(1)
        }
        this.showAttackMoves(coordinates)
      }
    })

    this.bitBoardService.moveTrigger$.pipe(
        takeUntil(this.ngUnsubscribe),
        filter(trigger => trigger !== null && trigger.color === this.color && trigger.status === 'moved' && trigger.id !== this.figure.id!)
    ).subscribe((trigger) => {
      const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
      const listOfMoves = this.formListOfAttackMovesWrapper(coordinates)
      this.bitBoardService.updateBitBoardAccordingColor(trigger?.color!, listOfMoves)
    })

    this.bitBoardService.checkMoveTrigger$.pipe(
        takeUntil(this.ngUnsubscribe),
        filter(trigger => trigger !== null && trigger.moveInfo.color === this.color && trigger.moveInfo.status === 'moved' && trigger.moveInfo.id !== this.figure.id!)
    ).subscribe((trigger) => {
      const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
      const listOfMoves = this.formListOfAttackMovesWrapper(coordinates)
      this.bitBoardService.updateCheckBoardAccordingColor(trigger?.moveInfo.color!, listOfMoves)
    })
  }

  showDots(count: number): void {
    let coordinates = this.boardService.getCoordinatesById(this.figure.id!)
    if(this.color === Colors.WHITE) {
      this.showDotsWhite(count, coordinates);
    } else {
      this.showDotsBlack(count, coordinates);
    }
  }

  showAttackMoves(coordinates: ICoordinates) {
    const attackMoves = this.formListOfAttackMovesWrapper(coordinates)
    this.boardService.showAttackMoves(attackMoves, this.figure?.color!)
  }

  showDotsWhite(count: number, coordinates: ICoordinates) {
    let { i: y, j: x } = coordinates; // y -> i, x -> j
    for(let i = y + 1; i <= coordinates.i + count; i++) {
      if(!this.boardService.board[i][x].figure) {
        this.boardService.board[i][x] = {...this.boardService.board[i][x], active: true}
      } else {
        break;
      }
    }
  }

  showDotsBlack(count: number, coordinates: ICoordinates) {
    let { i: y, j: x } = coordinates; // y -> i, x -> j
    for(let i = y - 1; i >= coordinates.i - count; i--) {
      if(!this.boardService.board[i][x].figure) {
        this.boardService.board[i][x] = {...this.boardService.board[i][x], active: true}
        this.boardService.board = [...this.boardService.board]
      } else {
        break;
      }
    }
  }

  formListOfAttackMovesWrapper(coordinates: ICoordinates) {
    let listOfMoves = []
    if(this.color === Colors.WHITE) {
      listOfMoves = this.formAttacksWhite(coordinates)
    } else {
      listOfMoves = this.formAttacksBlack(coordinates)
    }
    return listOfMoves
  }

  formAttacksWhite(coordinates: ICoordinates) {
    let listOfAttacks = [
      {
        i: coordinates.i + 1 >= 0 && coordinates.i + 1 < 8 ? coordinates.i + 1 : -1,
        j: coordinates.j - 1 >= 0 && coordinates.j - 1 < 8 ? coordinates.j - 1 : -1,
      },
      {
        i: coordinates.i + 1 >= 0 && coordinates.i + 1 < 8 ? coordinates.i + 1 : -1,
        j: coordinates.j + 1 >= 0 && coordinates.j + 1 < 8 ? coordinates.j + 1 : -1
      }
    ]
    return listOfAttacks.filter(
        move => move.i !== -1
    )
  }

  formAttacksBlack(coordinates: ICoordinates) {
    let listOfAttacks = [
      {
        i: coordinates.i - 1 >= 0 && coordinates.i - 1 < 8 ? coordinates.i - 1 : -1,
        j: coordinates.j - 1 >= 0 && coordinates.j - 1 < 8 ? coordinates.j - 1 : -1,
      },
      {
        i: coordinates.i - 1 >= 0 && coordinates.i - 1 < 8 ? coordinates.i - 1 : -1,
        j: coordinates.j + 1 >= 0 && coordinates.j + 1 < 8 ? coordinates.j + 1 : -1
      }
    ]
    return listOfAttacks.filter(
        move => move.i !== -1
    )
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next('')
    this.ngUnsubscribe.complete()
  }

}
