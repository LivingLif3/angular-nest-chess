import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Colors, ICoordinates} from "../../types/cell-type";
import {FiguresType} from "../../types/figures-type";
import {FigureInfo} from "../../types/figure-info";
import {ChessBoardService} from "../../services/chess-board.service";
import {ChooseElementService} from "../../services/choose-element.service";
import {CastlingService} from "../../services/castling.service";
import {filter, takeUntil} from "rxjs";
import {BitBoardService} from "../../services/bit-board.service";

@Component({
    selector: 'app-king',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './king.component.html',
    styleUrls: ['./king.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KingComponent implements OnInit {
    @Input() color!: Colors

    @Input() figure!: Partial<FigureInfo>

    imgPath: string = ''

    startCoord!: ICoordinates

    constructor(
        private boardService: ChessBoardService,
        private chooseService: ChooseElementService,
        private castlingService: CastlingService,
        private bitBoardService: BitBoardService
    ) {
    }

    ngOnInit() {
        this.startCoord = this.color === Colors.WHITE ? {i: 0, j: 4} : {i: 7, j: 4}

        this.imgPath = `${this.color + FiguresType.KING}.png`

        this.chooseService.choose$.pipe(
            filter(figure => figure?.id === this.figure.id)
        ).subscribe(figure => {
            let coordinates: ICoordinates = this.boardService.getCoordinatesById(this.figure.id!)
            if (coordinates.i !== this.startCoord.i || coordinates.j !== this.startCoord.j) {
                this.color === Colors.WHITE ? this.castlingService.whiteState.update(value => ({
                    ...value,
                    kingFirstMoved: true
                })) : this.castlingService.blackState.update(value => ({
                    ...value,
                    kingFirstMoved: true
                }))
            }
            this.boardService.hideAllDots()
            this.boardService.hideAllAttackCircles()
            this.showDots()
        })

        this.bitBoardService.moveTrigger$.pipe(
            filter(trigger => trigger !== null && trigger.color === this.color && trigger.status === 'moved' && trigger.id !== this.figure.id!)
        ).subscribe(trigger => {
            const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
            const listOfMoves = this.formGeneralMoves(coordinates)
            this.bitBoardService.updateBitBoardAccordingColor(trigger?.color!, listOfMoves.filter(
                move => move.i >= 0 && move.i < 8 && move.j >= 0 && move.j < 8
            ))
        })

        this.bitBoardService.checkMoveTrigger$.pipe(
            filter(trigger => trigger !== null && trigger.moveInfo.color === this.color && trigger.moveInfo.status === 'moved' && trigger.moveInfo.id !== this.figure.id!)
        ).subscribe((trigger) => {
            const coordinates = this.boardService.getCoordinatesById(this.figure.id!)
            const listOfMoves = this.formGeneralMoves(coordinates)
            this.bitBoardService.updateCheckBoardAccordingColor(trigger?.moveInfo.color!, listOfMoves.filter(
                move => move.i >= 0 && move.i < 8 && move.j >= 0 && move.j < 8
            ))
        })
    }

    showDots() {
        let coordinates = this.boardService.getCoordinatesById(this.figure.id!)
        let listOfPossibleMoves = this.formListOfCoords(coordinates);
        for (let move of listOfPossibleMoves.filter(move => !this.boardService.board[move.i][move.j].figure && this.boardService.board[move.i][move.j].figure?.type !== FiguresType.KING)) {
            this.boardService.board[move.i][move.j] = {...this.boardService.board[move.i][move.j], active: true}
        }
        this.color && this.boardService.showAttackMoves(listOfPossibleMoves, this.color)
    }

    formListOfCoords(coordinates: ICoordinates) {
        let listOfCoordinates: ICoordinates[] = []
        if (this.color === Colors.WHITE) {
            listOfCoordinates = [...listOfCoordinates, ...this.formCastlingMovesForWhite(coordinates)]
        } else {
            listOfCoordinates = [...listOfCoordinates, ...this.formCastlingMovesForBlack(coordinates)]
        }
        listOfCoordinates = [...listOfCoordinates,
            ...this.formGeneralMoves(coordinates)
        ]

        return listOfCoordinates.filter(
            move => move.i >= 0 && move.i < 8 && move.j >= 0 && move.j < 8
        )
    }

    formGeneralMoves(coordinates: ICoordinates) {
        let listOfCoordinates: ICoordinates[] = []
        for (let i = coordinates.i - 1; i <= coordinates.i + 1; i++) {
            for (let j = coordinates.j - 1; j <= coordinates.j + 1; j++) {
                listOfCoordinates = [
                    ...listOfCoordinates,
                    {
                        i,
                        j
                    }
                ]
            }
        }
        return listOfCoordinates
    }

    formCastlingMovesForWhite(coordinates: ICoordinates) {
        let rightCastlingCoords: ICoordinates[] = []
        let leftCastlingCoords: ICoordinates[] = []
        if (this.castlingService.checkWhiteCastlingRightRook()) {
            for (let j = coordinates.j + 1; j <= coordinates.j + 2; j++) {
                if(this.boardService.board[coordinates.i][j].figure) {
                    rightCastlingCoords = []
                    break;
                }
                rightCastlingCoords = [...rightCastlingCoords,
                    {
                        i: coordinates.i,
                        j
                    }
                ]
            }
        }
        if (this.castlingService.checkWhiteCastlingLeftRook()) {
            for (let j = coordinates.j - 1; j >= coordinates.j - 2; j--) {
                if(this.boardService.board[coordinates.i][j].figure) {
                    leftCastlingCoords = []
                    break;
                }
                leftCastlingCoords = [...leftCastlingCoords,
                    {
                        i: coordinates.i,
                        j
                    }
                ]
            }
        }
        return [...leftCastlingCoords, ...rightCastlingCoords]
    }

    formCastlingMovesForBlack(coordinates: ICoordinates) {
        let rightCastlingCoords: ICoordinates[] = []
        let leftCastlingCoords: ICoordinates[] = []
        if (this.castlingService.checkBlackCastlingRightRook()) {
            for (let j = coordinates.j - 1; j >= coordinates.j - 2; j--) {
                if(this.boardService.board[coordinates.i][j].figure) {
                    rightCastlingCoords = []
                    break;
                }
                rightCastlingCoords = [...rightCastlingCoords,
                    {
                        i: coordinates.i,
                        j
                    }
                ]
            }
        }
        if (this.castlingService.checkBlackCastlingLeftRook()) {
            for (let j = coordinates.j + 1; j <= coordinates.j + 2; j++) {
                if(this.boardService.board[coordinates.i][j].figure) {
                    leftCastlingCoords = []
                    break;
                }
                leftCastlingCoords = [...leftCastlingCoords,
                    {
                        i: coordinates.i,
                        j
                    }
                ]
            }
        }
        return [...leftCastlingCoords, ...rightCastlingCoords]
    }
}
