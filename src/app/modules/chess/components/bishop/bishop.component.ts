import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, ICoordinates} from "../../../../core/types/cell-type";
import {FiguresType} from "../../../../core/types/figures-type";
import {filter} from "rxjs";
import {ChooseElementService} from "../../../../core/services/choose-element.service";
import {ChessBoardService} from "../../../../core/services/chess-board.service";
import {FigureInfo} from "../../../../core/types/figure-info";
import {BitBoardService} from "../../../../core/services/bit-board.service";
import {AbstractFigureDirective} from "../../../../core/directives/abstract-figure/abstract-figure.directive";

@Component({
    selector: 'app-bishop',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bishop.component.html',
    styleUrls: ['./bishop.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BishopComponent extends AbstractFigureDirective implements OnInit {
    constructor(
        private boardService: ChessBoardService,
        private chooseService: ChooseElementService,
        private bitBoardService: BitBoardService,
    ) {
        super(boardService, chooseService, bitBoardService)
    }

    ngOnInit() {
        this.imgPath = `${this.color + FiguresType.BISHOP}.png`

        this.chooseService.choose$.pipe(
            filter(figure => figure?.id === this.figure.id)
        ).subscribe(figure => {
            this.boardService.hideAllDots()
            this.boardService.hideAllAttackCircles()
            this.showDots()
        })

        this.bitBoardService.moveTrigger$.pipe(
            filter(trigger => trigger !== null && trigger.color === this.color && trigger.status === 'moved' && trigger.id !== this.figure.id!)
        ).subscribe((trigger) => {
            const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
            const listOfMoves = this.formListOfCoords(this.boardService.board, coordinates)
            this.bitBoardService.updateBitBoardAccordingColor(trigger?.color!, [...listOfMoves.possibleMoves,
                ...listOfMoves.attackMoves])
        })

        this.bitBoardService.checkMoveTrigger$.pipe(
            filter(trigger => trigger !== null && trigger.moveInfo.color === this.color && trigger.moveInfo.status === 'moved' && trigger.moveInfo.id !== this.figure.id!)
        ).subscribe((trigger) => {
            const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
            const listOfMoves = this.formListOfCoords(trigger?.board, coordinates)
            this.bitBoardService.updateCheckBoardAccordingColor(trigger?.moveInfo.color!, [...listOfMoves.possibleMoves,
                ...listOfMoves.attackMoves])
        })
    }

    showDots() {
        let coordinates = this.boardService.getCoordinatesById(this.figure.id!)
        const listOfPossibleMoves = this.formListOfCoords(this.boardService.board, coordinates)
        for (let move of listOfPossibleMoves.possibleMoves) {
            this.boardService.board[move.i][move.j] = {...this.boardService.board[move.i][move.j], active: true}
        }
        this.boardService.showAttackMoves(listOfPossibleMoves.attackMoves, this.color)
    }

    formListOfCoords(board: any, coordinates: ICoordinates) {
        let possibleMoves: ICoordinates[] = []
        let attackMoves: ICoordinates[] = []

        // To the top right diagonal
        for (let i = coordinates.i + 1; i < 8; i++) {
            let j = coordinates.j + Math.abs(i - coordinates.i)
            if (j < 8 && !board[i][j]?.figure) {
                possibleMoves = [...possibleMoves, {
                    i,
                    j
                }]
            } else if (j >= 8) {
                break;
            } else if (board[i][j]?.figure) {
                attackMoves = [...attackMoves, {
                    i,
                    j
                }]
                break;
            }
        }
        // To the top left diagonal
        for (let i = coordinates.i + 1; i < 8; i++) {
            let j = coordinates.j - Math.abs(i - coordinates.i)
            if (j >= 0 && !board[i][j]?.figure) {
                possibleMoves = [...possibleMoves, {
                    i,
                    j
                }]
            } else if (j < 0) {
                break;
            } else if (board[i][j]?.figure) {
                attackMoves = [...attackMoves, {
                    i,
                    j
                }]
                break;
            }
            j--;
        }
        // To the bottom left diagonal
        for (let i = coordinates.i - 1; i >= 0; i--) {
            let j = coordinates.j - Math.abs(i - coordinates.i)
            if (j >= 0 && !board[i][j]?.figure) {
                possibleMoves = [...possibleMoves, {
                    i,
                    j
                }]
            } else if (j < 0) {
                break;
            } else if (board[i][j]?.figure) {
                attackMoves = [...attackMoves, {
                    i,
                    j
                }]
                break;
            }
        }
        // To the bottom right diagonal
        for (let i = coordinates.i - 1; i >= 0; i--) {
            let j = coordinates.j + Math.abs(i - coordinates.i)
            if (j < 8 && !board[i][j]?.figure) {
                possibleMoves = [...possibleMoves, {
                    i,
                    j
                }]
            } else if (j >= 8) {
                break;
            } else if (board[i][j]?.figure) {
                attackMoves = [...attackMoves, {
                    i,
                    j
                }]
                break;
            }
        }
        return { possibleMoves, attackMoves }
    }

}
