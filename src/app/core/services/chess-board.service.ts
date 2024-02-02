import {Injectable} from '@angular/core';
import {FiguresType} from "../types/figures-type";
import {Colors, ICoordinates} from "../types/cell-type";
import {CreateFigureService} from "./create-figure.service";

@Injectable({
    providedIn: 'root'
})
export class ChessBoardService {

    board = [
        [
            {
                figure: this.createFigure.createFigure(FiguresType.ROOK, Colors.WHITE),
                startCoords: {
                    i: 0,
                    j: 0
                },
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.KNIGHT, Colors.WHITE),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.BISHOP, Colors.WHITE),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.QUEEN, Colors.WHITE),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.KING, Colors.WHITE),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.BISHOP, Colors.WHITE),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.KNIGHT, Colors.WHITE),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.ROOK, Colors.WHITE),
                startCoords: {
                    i: 0,
                    j: 7
                },
                attack: false
            },
        ], // 1
        Array(8).fill(0).map(el => ({
            figure: this.createFigure.createFigure(FiguresType.PAWN, Colors.WHITE),
            firstMove: true,
            attack: false
        })), // 2
        Array(8).fill({
            figure: null,
            active: false
        }), // 3
        Array(8).fill({
            figure: null,
            active: false
        }), // 4
        Array(8).fill({
            figure: null,
            active: false
        }), // 5
        Array(8).fill({
            figure: null,
            active: false
        }), // 6
        Array(8).fill(0).map(el => ({
            figure: this.createFigure.createFigure(FiguresType.PAWN, Colors.BLACK),
            firstMove: true
        })), // 7
        [
            {
                figure: this.createFigure.createFigure(FiguresType.ROOK, Colors.BLACK),
                startCoords: {
                    i: 7,
                    j: 0
                },
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.KNIGHT, Colors.BLACK),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.BISHOP, Colors.BLACK),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.QUEEN, Colors.BLACK),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.KING, Colors.BLACK),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.BISHOP, Colors.BLACK),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.KNIGHT, Colors.BLACK),
                attack: false
            },
            {
                figure: this.createFigure.createFigure(FiguresType.ROOK, Colors.BLACK),
                startCoords: {
                    i: 7,
                    j: 7
                },
                attack: false
            }
        ] // 8
    ]

    kingCoordinates = {
        [Colors.WHITE]: this.getWhiteKingCoords,
        [Colors.BLACK]: this.getBlackKingCoords
    }

    constructor(private createFigure: CreateFigureService) {
    }

    getCoordinatesById(id: number): ICoordinates {
        return {
            i: Math.floor(id / 10),
            j: id % 10
        }
    }

    showAttackMoves(attackMoves: ICoordinates[], color: Colors) {
        const possibleAttacks = attackMoves.filter(
            move => this.board[move.i][move.j].figure
        )
        for (let move of possibleAttacks) {
            if (this.board[move.i][move.j].figure?.color !== color
                && this.board[move.i][move.j].figure?.type !== FiguresType.KING) {
                this.board[move.i][move.j] = {...this.board[move.i][move.j], attack: true}
            }
        }
    }

    hideAllDots() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!this.board[i][j].figure && this.board[i][j].active) {
                    this.board[i][j] = {...this.board[i][j], active: false};
                }
            }
        }
    }

    hideAllAttackCircles() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j].figure && this.board[i][j].attack) {
                    this.board[i][j] = {...this.board[i][j], attack: false};
                }
            }
        }
    }

    getWhiteKingCoords(board: any): ICoordinates {
        let coordinates: ICoordinates
        for (let i = 0; i < 8; i++) {
            let j = board[i].findIndex((el: any) => el.figure?.type === FiguresType.KING && el.figure?.color === Colors.WHITE)
            if (j !== -1) {
                coordinates = {
                    i,
                    j
                }
            }
        }
        return coordinates!
    }

    getBlackKingCoords(board: any): ICoordinates {
        let coordinates: ICoordinates
        for (let i = 0; i < 8; i++) {
            let j = board[i].findIndex((el: any) => el.figure?.type === FiguresType.KING && el.figure?.color === Colors.BLACK)
            if (j !== -1) {
                coordinates = {
                    i,
                    j
                }
            }
        }
        return coordinates!
    }
}
