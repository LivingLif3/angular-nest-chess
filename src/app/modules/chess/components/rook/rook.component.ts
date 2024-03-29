import {ChangeDetectionStrategy, Component, DestroyRef, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICoordinates} from "../../../../core/types/cell-type";
import {FiguresType} from "../../../../core/types/figures-type";
import {ChessBoardService} from "../../../../core/services/chess-board.service";
import {ChooseElementService} from "../../../../core/services/choose-element.service";
import {BitBoardService} from "../../../../core/services/bit-board.service";
import {filter} from "rxjs";
import {CastlingService} from "../../../../core/services/castling.service";
import {AbstractFigureDirective} from "../../../../core/directives/abstract-figure/abstract-figure.directive";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-rook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rook.component.html',
  styleUrls: ['./rook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RookComponent extends AbstractFigureDirective implements OnInit{
  constructor(
      private boardService: ChessBoardService,
      private chooseService: ChooseElementService,
      private bitBoardService: BitBoardService,
      private castlingService: CastlingService,
      private destroyRef: DestroyRef
  ) {
    super(boardService, chooseService, bitBoardService, castlingService)
  }

  ngOnInit() {
    this.imgPath = `${this.color + FiguresType.ROOK}.png`

    this.chooseService.choose$.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(figure => figure?.id === this.figure.id)
    ).subscribe(figure => {
      const coordinates: ICoordinates = this.boardService.getCoordinatesById(this.figure.id!)
      const startCoordinates = this.boardService.board[coordinates.i][coordinates.j].startCoords
      if (startCoordinates.i !== coordinates.i || startCoordinates.j !== coordinates.j) {
        const sideElement =
            this.castlingService.rooksSides[this.figure.color!].find(el => el.coords.i === startCoordinates.i && el.coords.j === startCoordinates.j)
        if(sideElement) this.castlingService.updateRookState(this.figure.color!, sideElement.side)
      }
      this.boardService.hideAllDots()
      this.boardService.hideAllAttackCircles()
      this.showDots()
    })

    this.bitBoardService.moveTrigger$.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(trigger => trigger !== null && trigger.color === this.color && trigger.status === 'moved' && trigger.id !== this.figure.id!)
    ).subscribe((trigger) => {
      const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
      const listOfStraightMoves = this.formListOfStraightMoves(this.boardService.board, coordinates)
      this.bitBoardService.updateBitBoardAccordingColor(trigger?.color!, [...listOfStraightMoves.possibleMoves,
        ...listOfStraightMoves.attackMoves])
    })

    this.bitBoardService.checkMoveTrigger$.pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(trigger => trigger !== null && trigger.moveInfo.color === this.color && trigger.moveInfo.status === 'moved' && trigger.moveInfo.id !== this.figure.id!)
    ).subscribe((trigger) => {
      const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
      const listOfStraightMoves = this.formListOfStraightMoves(trigger?.board, coordinates)
      this.bitBoardService.updateCheckBoardAccordingColor(trigger?.moveInfo.color!, [...listOfStraightMoves.possibleMoves,
        ...listOfStraightMoves.attackMoves])
    })
  }

  showDots() {
    let coordinates = this.boardService.getCoordinatesById(this.figure.id!)
    let listOfPossibleMoves = this.formListOfStraightMoves(this.boardService.board, coordinates);
    for (let move of listOfPossibleMoves.possibleMoves) {
      this.boardService.board[move.i][move.j] = {...this.boardService.board[move.i][move.j], active: true}
    }
    this.boardService.showAttackMoves(listOfPossibleMoves.attackMoves, this.color)
  }

  formListOfStraightMoves(board: any, coordinates: ICoordinates) {
    let possibleMoves: ICoordinates[] = []
    let attackMoves: ICoordinates[] = []
    // Line to top
    for (let i = coordinates.i + 1; i < 8; i++) {
      if (!board[i][coordinates.j].figure) {
        possibleMoves = [...possibleMoves, {
          i,
          j: coordinates.j
        }]
      } else if (board[i][coordinates.j].figure) {
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
      if (!board[i][coordinates.j].figure) {
        possibleMoves = [...possibleMoves, {
          i,
          j: coordinates.j
        }]
      } else if (board[i][coordinates.j].figure) {
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
      if (!board[coordinates.i][j].figure) {
        possibleMoves = [...possibleMoves, {
          i: coordinates.i,
          j
        }]
      } else if (board[coordinates.i][j].figure) {
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
      if (!board[coordinates.i][j].figure) {
        possibleMoves = [...possibleMoves, {
          i: coordinates.i,
          j
        }]
      } else if (board[coordinates.i][j].figure) {
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
