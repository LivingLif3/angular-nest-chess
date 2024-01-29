import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Colors, ICoordinates} from "../../types/cell-type";
import {FiguresType} from "../../types/figures-type";
import {ChessBoardService} from "../../services/chess-board.service";
import {ChooseElementService} from "../../services/choose-element.service";
import {BitBoardService} from "../../services/bit-board.service";
import {filter} from "rxjs";
import {FigureInfo} from "../../types/figure-info";

@Component({
  selector: 'app-rook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rook.component.html',
  styleUrls: ['./rook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RookComponent implements OnInit{
  @Input() color!: Colors
  @Input() figure!: Partial<FigureInfo>

  imgPath: string = ''

  constructor(
      private boardService: ChessBoardService,
      private chooseService: ChooseElementService,
      private bitBoardService: BitBoardService
  ) {
  }

  ngOnInit() {
    this.imgPath = `${this.color + FiguresType.ROOK}.png`

    this.chooseService.choose$.pipe(
        filter(figure => figure?.id === this.figure.id)
    ).subscribe(figure => {
      this.boardService.hideAllDots()
      this.showDots()
    })

    this.bitBoardService.moveTrigger$.pipe(
        filter(trigger => trigger !== null && trigger.color === this.color && trigger.status === 'moved' && trigger.id !== this.figure.id!)
    ).subscribe((trigger) => {
      const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
      const listOfStraightMoves = this.formListOfStraightMoves(coordinates)

      this.bitBoardService.updateBitBoardAccordingColor(trigger?.color!, [...listOfStraightMoves.possibleMoves,
        ...listOfStraightMoves.attackMoves])
      // this.bitBoardService.bitBoard.update(value => {
      //   const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
      //   const listOfStraightMoves = this.formListOfStraightMoves(coordinates)
      //   for (let move of [...listOfStraightMoves.possibleMoves, ...listOfStraightMoves.attackMoves]) {
      //     value[move.i][move.j] = 1
      //   }
      //   return [...value]
      // })
    })
  }

  showDots() {
    let coordinates = this.boardService.getCoordinatesById(this.figure.id!)
    let listOfPossibleMoves = this.formListOfStraightMoves(coordinates).possibleMoves;
    for (let move of listOfPossibleMoves) {
      this.boardService.board[move.i][move.j] = {...this.boardService.board[move.i][move.j], active: true}
    }
  }

  formListOfStraightMoves(coordinates: ICoordinates) {
    let possibleMoves: ICoordinates[] = []
    let attackMoves: ICoordinates[] = []
    // Line to top
    for (let i = coordinates.i + 1; i < 8; i++) {
      if (!this.boardService.board[i][coordinates.j].figure) {
        possibleMoves = [...possibleMoves, {
          i,
          j: coordinates.j
        }]
      } else if (this.boardService.board[i][coordinates.j].figure) {
        attackMoves = [...attackMoves, {
          i,
          j: coordinates.j
        }]
        break;
      } else {
        break;
      }
    }
    // Line to bottom
    for (let i = coordinates.i - 1; i >= 0; i--) {
      if (!this.boardService.board[i][coordinates.j].figure) {
        possibleMoves = [...possibleMoves, {
          i,
          j: coordinates.j
        }]
      } else if (this.boardService.board[i][coordinates.j].figure) {
        attackMoves = [...attackMoves, {
          i,
          j: coordinates.j
        }]
        break;
      } else {
        break;
      }
    }
    // Line to right
    for (let j = coordinates.j + 1; j < 8; j++) {
      if (!this.boardService.board[coordinates.i][j].figure) {
        possibleMoves = [...possibleMoves, {
          i: coordinates.i,
          j
        }]
      } else if (this.boardService.board[coordinates.i][j].figure) {
        attackMoves = [...attackMoves, {
          i: coordinates.i,
          j
        }]
        break;
      } else {
        break;
      }
    }
    // Line to left
    for (let j = coordinates.j - 1; j >= 0; j--) {
      if (!this.boardService.board[coordinates.i][j].figure) {
        possibleMoves = [...possibleMoves, {
          i: coordinates.i,
          j
        }]
      } else if (this.boardService.board[coordinates.i][j].figure) {
        attackMoves = [...attackMoves, {
          i: coordinates.i,
          j
        }]
        break;
      } else {
        break;
      }
    }
    return {possibleMoves, attackMoves}
  }
}
