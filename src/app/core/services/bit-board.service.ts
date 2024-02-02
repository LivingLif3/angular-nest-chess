import {Injectable, signal} from '@angular/core';
import {ChessBoardService} from "./chess-board.service";
import {Colors, ICoordinates} from "../types/cell-type";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BitBoardService {

    private moveTrigger = new BehaviorSubject<{ status: string, color: Colors, id: number } | null>(null)
    moveTrigger$ = this.moveTrigger.asObservable()

    private checkMoveTrigger = new BehaviorSubject<{ board: any, moveInfo: { status: string, color: Colors, id: number } } | null>(null)
    checkMoveTrigger$ = this.checkMoveTrigger.asObservable()

    blackBitBoard = signal(new Array(8).fill(0).map(() => new Array(8).fill(0)))
    whiteBitBoard = signal(new Array(8).fill(0).map(() => new Array(8).fill(0)))

    checkBitBoard = signal(new Array(8).fill(0).map(() => new Array(8).fill(0)))

    constructor(
        private boardService: ChessBoardService
    ) {
    }

    updateBitBoardAccordingColor(color: Colors, moves: ICoordinates[]) {
        if (color === Colors.WHITE) {
            this.whiteBitBoard.update((value) => {
                for (let move of moves) {
                    if (move.j !== -1) value[move.i][move.j] = 1
                }
                return [...value]
            })
        } else {
            this.blackBitBoard.update((value) => {
                for (let move of moves) {
                    if (move.j !== -1) value[move.i][move.j] = 1
                }
                return [...value]
            })
        }
    }

    updateCheckBoardAccordingColor(color: Colors, moves: ICoordinates[]) {
        this.checkBitBoard.update((value) => {
            for (let move of moves) {
                if (move.j !== -1) value[move.i][move.j] = 1
            }
            return [...value]
        })
    }


    triggerCheckMove(board: any, color: Colors, id: number) {
        this.checkMoveTrigger.next({
            board,
            moveInfo: {
                status: 'moved',
                color,
                id
            }
        })
    }

    triggerMove(color: Colors, id: number) {
        this.moveTrigger.next({
            status: 'moved',
            color,
            id
        });
    }

    clearWhiteBitBoard() {
        this.whiteBitBoard.update(value => new Array(8).fill(0).map(() => new Array(8).fill(0)))
    }

    clearCheckBitBoard() {
        this.checkBitBoard.update(value => new Array(8).fill(0).map(() => new Array(8).fill(0)))
    }


    checkForChecksForWhite(board: any): boolean {
        const whiteKingCoords = this.boardService.getWhiteKingCoords(board)
        if (this.blackBitBoard()[whiteKingCoords.i][whiteKingCoords.j]) {
            return true
        } else {
            return false
        }
    }

    checkForChecksForBlack(board: any): boolean {
        const blackKingCoords = this.boardService.getBlackKingCoords(board)
        if (this.whiteBitBoard()[blackKingCoords.i][blackKingCoords.j]) {
            return true
        } else {
            return false
        }
    }

    checkForPredictedMoveChecksForBlack(board: any): boolean {
        const blackKingCoords = this.boardService.getBlackKingCoords(board)
        if (this.checkBitBoard()[blackKingCoords.i][blackKingCoords.j]) {
            return true
        } else {
            return false
        }
    }

    checkForPredictedMoveChecksForWhite(board: any): boolean {
        const whiteKingCoords = this.boardService.getWhiteKingCoords(board)
        if (this.checkBitBoard()[whiteKingCoords.i][whiteKingCoords.j]) {
            return true
        } else {
            return false
        }
    }

    checkWhiteKingCanMakeMove() {
        const whiteKingCoords = this.boardService.getWhiteKingCoords(this.boardService.board)
        const possibleMoves = this.genMovesForKing(whiteKingCoords)
        for (let move of possibleMoves) {
            if (!this.whiteBitBoard()[move.i][move.j]) {
                return true
            }
        }
        return false
    }

    checkBlackKingCanMakeMove() {
        const blackKingCoords = this.boardService.getBlackKingCoords(this.boardService.board)
        const possibleMoves = this.genMovesForKing(blackKingCoords)
        for (let move of possibleMoves) {
            if (!this.blackBitBoard()[move.i][move.j]) {
                return true
            }
        }
        return false
    }

    genMovesForKing(coordinates: ICoordinates) {
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
        return listOfCoordinates.filter(move => move.i >= 0 && move.i < 8 && move.j >= 0 && move.j < 8)
    }
}
