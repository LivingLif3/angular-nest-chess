import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, ICoordinates} from "../../types/cell-type";
import {FiguresType} from "../../types/figures-type";
import {filter} from "rxjs";
import {ChooseElementService} from "../../services/choose-element.service";
import {ChessBoardService} from "../../services/chess-board.service";
import {FigureInfo} from "../../types/figure-info";
import {BitBoardService} from "../../services/bit-board.service";

@Component({
    selector: 'app-bishop',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bishop.component.html',
    styleUrls: ['./bishop.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BishopComponent implements OnInit {
    @Input() color!: Colors

    @Input() figure!: Partial<FigureInfo>

    constructor(
        private chooseService: ChooseElementService,
        private boardService: ChessBoardService,
        private bitBoardService: BitBoardService
    ) {
    }

    imgPath: string = ''

    ngOnInit() {
        this.imgPath = `${this.color + FiguresType.BISHOP}.png`

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
            this.bitBoardService.updateBitBoardAccordingColor(trigger?.color!, [...listOfMoves.possibleMoves,
                ...listOfMoves.attackMoves])
            // this.bitBoardService.bitBoard.update(value => {
            //     const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
            //     const listOfMoves = this.formListOfCoords(coordinates)
            //     for (let move of [...listOfMoves.possibleMoves, ...listOfMoves.attackMoves]) {
            //         value[move.i][move.j] = 1
            //     }
            //     return [...value]
            // })
        })
    }

    showDots() {
        let coordinates = this.boardService.getCoordinatesById(this.figure.id!)
        const listOfPossibleMoves = this.formListOfCoords(coordinates)
        for (let move of listOfPossibleMoves.possibleMoves) {
            this.boardService.board[move.i][move.j] = {...this.boardService.board[move.i][move.j], active: true}
        }
    }

    formListOfCoords(coordinates: ICoordinates) {
        let possibleMoves: ICoordinates[] = []
        let attackMoves: ICoordinates[] = []

        // To the top right diagonal
        for (let i = coordinates.i + 1; i < 8; i++) {
            let j = coordinates.j + Math.abs(i - coordinates.i)
            if (j < 8 && !this.boardService.board[i][j]?.figure) {
                possibleMoves = [...possibleMoves, {
                    i,
                    j
                }]
            } else if (j >= 8) {
                break;
            } else if (this.boardService.board[i][j]?.figure) {
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
            if (j >= 0 && !this.boardService.board[i][j]?.figure) {
                possibleMoves = [...possibleMoves, {
                    i,
                    j
                }]
            } else if (j < 0) {
                break;
            } else if (this.boardService.board[i][j]?.figure) {
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
            if (j >= 0 && !this.boardService.board[i][j]?.figure) {
                possibleMoves = [...possibleMoves, {
                    i,
                    j
                }]
            } else if (j < 0) {
                break;
            } else if (this.boardService.board[i][j]?.figure) {
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
            if (j < 8 && !this.boardService.board[i][j]?.figure) {
                possibleMoves = [...possibleMoves, {
                    i,
                    j
                }]
            } else if (j >= 8) {
                break;
            } else if (this.boardService.board[i][j]?.figure) {
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
