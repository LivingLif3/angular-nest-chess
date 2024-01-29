import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Colors, ICoordinates} from "../../types/cell-type";
import {FiguresType} from "../../types/figures-type";
import {FigureInfo} from "../../types/figure-info";
import {ChessBoardService} from "../../services/chess-board.service";
import {ChooseElementService} from "../../services/choose-element.service";
import {filter} from "rxjs";
import {BitBoardService} from "../../services/bit-board.service";
import {trigger} from "@angular/animations";

@Component({
  selector: 'app-knight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knight.component.html',
  styleUrls: ['./knight.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnightComponent implements OnInit{
  @Input() color!: Colors

  @Input() figure!: Partial<FigureInfo>

  imgPath: string = ''

  constructor(
      private boardService: ChessBoardService,
      private chooseService: ChooseElementService,
      private bitBoardService: BitBoardService
  ) {}

  ngOnInit() {
    this.imgPath = `${this.color + FiguresType.KNIGHT}.png`

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
      const listOfMoves = this.formListOfCoords(coordinates)
      this.bitBoardService.updateBitBoardAccordingColor(trigger?.color!, listOfMoves)
      // this.bitBoardService.bitBoard.update(value => {
      //   const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
      //   const listOfMoves = this.formListOfCoords(coordinates)
      //   for(let move of listOfMoves) {
      //     value[move.i][move.j] = 1
      //   }
      //   return [...value]
      // })
    })
  }

  showDots() {
    let coordinates = this.boardService.getCoordinatesById(this.figure.id!)
    let listOfPossibleMoves = this.formListOfCoords(coordinates);
    listOfPossibleMoves = listOfPossibleMoves.filter(
        move => !this.boardService.board[move.i][move.j].figure
    )
    for(let move of listOfPossibleMoves) {
      this.boardService.board[move.i][move.j] = { ...this.boardService.board[move.i][move.j], active: true }
    }
  }

  formListOfCoords(coordinates: ICoordinates) {
    let listOfCoordinates = [
      { // top knight moves
        i: coordinates.i + 2,
        j: coordinates.j - 1
      },
      {
        i: coordinates.i + 2,
        j: coordinates.j + 1
      },
      { // bottom knight moves
        i: coordinates.i - 2,
        j: coordinates.j - 1
      },
      {
        i: coordinates.i - 2,
        j: coordinates.j + 1
      },
      { // left knight moves
        i: coordinates.i + 1,
        j: coordinates.j - 2
      },
      {
        i: coordinates.i - 1,
        j: coordinates.j - 2
      },
      { // right knight moves
        i: coordinates.i + 1,
        j: coordinates.j + 2
      },
      {
        i: coordinates.i - 1,
        j: coordinates.j + 2
      }
    ]
    return listOfCoordinates.filter(
        move => move.i <= 7 && move.i >= 0 && move.j <= 7 && move.j >= 0
    )
  }
}
