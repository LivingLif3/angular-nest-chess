import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, DestroyRef,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, ICoordinates} from "../../types/cell-type";
import {FiguresType} from "../../types/figures-type";
import {ChessBoardService} from "../../services/chess-board.service";
import {ChooseElementService} from "../../services/choose-element.service";
import {FigureInfo} from "../../types/figure-info";
import {ShowDotsService} from "../../services/show-dots.service";
import {filter, Subject, takeUntil} from "rxjs";
import {BitBoardService} from "../../services/bit-board.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-pawn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pawn.component.html',
  styleUrls: ['./pawn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PawnComponent implements OnInit, OnChanges, OnDestroy {
  @Input() color!: Colors

  @Input() figure!: Partial<FigureInfo>

  private ngUnsubscribe = new Subject();

  firstMove: boolean = true

  imgPath: string = ''

  startCoordinateY!: Number;

  constructor(
    private boardService: ChessBoardService,
    private chooseService: ChooseElementService,
    private showDotsService: ShowDotsService,
    private bitBoardService: BitBoardService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    console.log(this.figure.id, "INIT ID")
    this.startCoordinateY = this.color === Colors.WHITE ? 1 : 6;

    this.imgPath = `${this.color + FiguresType.PAWN}.png`
    this.chooseService.choose$.subscribe(figure => {
      let coordinates = this.boardService.getCoordinatesById(this.figure.id!);
      if(figure?.id === this.figure.id) {
        this.boardService.hideAllDots()
        if(coordinates.i !== this.startCoordinateY) {
          this.firstMove = false;
        }
        if(this.firstMove) {
         this.showDotsWrapper(2)
        } else {
          this.showDotsWrapper(1)
        }
        this.ref.markForCheck()
      }
    })

    this.bitBoardService.moveTrigger$.pipe(
        takeUntil(this.ngUnsubscribe),
        filter(trigger => trigger !== null && trigger.color === this.color && trigger.status === 'moved' && trigger.id !== this.figure.id!)
    ).subscribe((trigger) => {
      console.log(trigger, "TRIGGER")
      console.log(this.figure, "FIGURE")
      console.log(this.boardService.board, "HERE")
      const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
      console.log(coordinates)
      const listOfMoves = this.formListOfAttackMovesWrapper(coordinates)
      console.log(listOfMoves)
      this.bitBoardService.updateBitBoardAccordingColor(trigger?.color!, listOfMoves)
      // this.bitBoardService.bitBoard.update(value => {
      //   const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
      //   const listOfMoves = this.formListOfAttackMovesWrapper(coordinates)
      //   for(let move of listOfMoves) {
      //     if(move.j !== -1) value[move.i][move.j] = 1
      //   }
      //   return [...value]
      // })
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['figure']) {
    //   console.log(changes['figure'])
    // }
  }

  showDotsWrapper(count: number) {
    let coordinates = this.boardService.getCoordinatesById(this.figure.id!)
    if(this.color === Colors.WHITE) {
      this.showDotsWhite(count, coordinates);
    } else {
      this.showDotsBlack(count, coordinates);
    }
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
    console.log(this.figure.id)
    console.log('DESTROY')
  }

}
