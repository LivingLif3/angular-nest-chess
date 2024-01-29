import {Injectable, signal} from '@angular/core';
import {ChessBoardService} from "./chess-board.service";
import {Colors, ICoordinates} from "../types/cell-type";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BitBoardService {

    private moveTrigger = new BehaviorSubject<{status: string, color: Colors, id: number} | null>(null)
    moveTrigger$ = this.moveTrigger.asObservable()

    bitBoard = signal(new Array(8).fill(0).map(() => new Array(8).fill(0)))
    blackBitBoard = signal(new Array(8).fill(0).map(() => new Array(8).fill(0)))
    whiteBitBoard = signal(new Array(8).fill(0).map(() => new Array(8).fill(0)))

    constructor(
        private boardService: ChessBoardService
    ) {
    }

    updateBitBoardAccordingColor(color: Colors, moves: ICoordinates[]) {
        if (color === Colors.WHITE) {
            this.whiteBitBoard.update((value) => {
                for(let move of moves) {
                    if(move.j !== -1) value[move.i][move.j] = 1
                }
                return [...value]
            })
        } else {
            this.blackBitBoard.update((value) => {
                for(let move of moves) {
                    if(move.j !== -1) value[move.i][move.j] = 1
                }
                return [...value]
            })
        }
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

    clearBlackBitBoard() {
        this.blackBitBoard.update(value => new Array(8).fill(0).map(() => new Array(8).fill(0)))
    }

    checkForChecksForWhite(): boolean {
        const whiteKingCoords = this.boardService.getWhiteKingCoords()
        console.log(whiteKingCoords, "WHITE KING COORDS")
        if (this.whiteBitBoard()[whiteKingCoords.i][whiteKingCoords.j]) {
            return true
        } else {
            return false
        }
    }

    checkForChecksForBlack(): boolean {
        const blackKingCoords = this.boardService.getBlackKingCoords()
        if (this.blackBitBoard()[blackKingCoords.i][blackKingCoords.j]) {
            return true
        } else {
            return false
        }
    }
}
