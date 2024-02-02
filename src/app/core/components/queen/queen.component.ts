import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, ICoordinates} from "../../types/cell-type";
import {FiguresType} from "../../types/figures-type";
import {ChessBoardService} from "../../services/chess-board.service";
import {ChooseElementService} from "../../services/choose-element.service";
import {FigureInfo} from "../../types/figure-info";
import {filter} from "rxjs";
import {BitBoardService} from "../../services/bit-board.service";

@Component({
    selector: 'app-queen',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './queen.component.html',
    styleUrls: ['./queen.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueenComponent implements OnInit {
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
        this.imgPath = `${this.color + FiguresType.QUEEN}.png`

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
            const listOfStraightMoves = this.formListOfStraightMoves(this.boardService.board, coordinates)
            const listOfDiagonalMoves = this.formListOfDiagonalMoves(this.boardService.board, coordinates)
            this.bitBoardService.updateBitBoardAccordingColor(trigger?.color!, [...listOfStraightMoves.possibleMoves, ...listOfStraightMoves.attackMoves,
                ...listOfDiagonalMoves.attackMoves, ...listOfDiagonalMoves.possibleMoves])
        })

        this.bitBoardService.checkMoveTrigger$.pipe(
            filter(trigger => trigger !== null && trigger.moveInfo.color === this.color && trigger.moveInfo.status === 'moved' && trigger.moveInfo.id !== this.figure.id!)
        ).subscribe((trigger) => {
            const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
            const listOfStraightMoves = this.formListOfStraightMoves(trigger?.board, coordinates)
            const listOfDiagonalMoves = this.formListOfDiagonalMoves(trigger?.board, coordinates)
            console.log(listOfDiagonalMoves.attackMoves, "DIAGONAL ATTACK MOVES")
            this.bitBoardService.updateCheckBoardAccordingColor(trigger?.moveInfo.color!, [...listOfStraightMoves.possibleMoves, ...listOfStraightMoves.attackMoves,
                ...listOfDiagonalMoves.attackMoves, ...listOfDiagonalMoves.possibleMoves])
        })
    }

    showDots() {
        const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
        const listOfPossibleMoves = this.formListOfStraightMoves(this.boardService.board, coordinates);
        const listOfDiagonalMoves = this.formListOfDiagonalMoves(this.boardService.board, coordinates)
        const listOfMoves = [...listOfPossibleMoves.possibleMoves, ...listOfDiagonalMoves.possibleMoves];
        for (let move of listOfMoves) {
            this.boardService.board[move.i][move.j] = {...this.boardService.board[move.i][move.j], active: true}
        }
        this.boardService.showAttackMoves([...listOfPossibleMoves.attackMoves, ...listOfDiagonalMoves.attackMoves], this.color)
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

    formListOfDiagonalMoves(board: any, coordinates: ICoordinates) {
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
        return {possibleMoves, attackMoves}
    }
}
