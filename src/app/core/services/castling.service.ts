import {computed, Injectable, signal} from '@angular/core';
import {Colors} from "../types/cell-type";

@Injectable({
    providedIn: 'root'
})
export class CastlingService {

    blackState = signal({
        leftRookFirstMoved: false,
        rightRookFirstMoved: false,
        kingFirstMoved: false,
        madeCastling: false
    })

    whiteState = signal({
        leftRookFirstMoved: false,
        rightRookFirstMoved: false,
        kingFirstMoved: false,
        madeCastling: false
    })

    private listOfCastlingWhiteCells = [
        {
            king: {
                i: 0,
                j: 6
            },
            rook: {
                i: 0,
                j: 5,
                startCoords: {
                    i: 0,
                    j: 7
                }
            }
        },
        {
            king: {
                i: 0,
                j: 2
            },
            rook: {
                i: 0,
                j: 3,
                startCoords: {
                    i: 0,
                    j: 0
                }
            }
        }
    ]

    private listOfCastlingBlackCells = [
        {
            king: {
                i: 7,
                j: 6
            },
            rook: {
                i: 7,
                j: 5,
                startCoords: {
                    i: 7,
                    j: 7
                }
            }
        },
        {
            king: {
                i: 7,
                j: 2
            },
            rook: {
                i: 7,
                j: 3,
                startCoords: {
                    i: 7,
                    j: 0
                }
            }
        }
    ]

    rooksSides = {
        [Colors.WHITE]: [
            {
                coords: {i: 0, j: 0},
                side: 'left',
            },
            {
                coords: {i: 0, j: 7},
                side: 'right',
            }
        ],
        [Colors.BLACK]: [
            {
                coords: {i: 7, j: 7},
                side: 'left'
            },
            {
                coords: {i: 7, j: 0},
                side: 'right'
            }
        ]
    }

    castlingCells = {
        [Colors.WHITE]: this.listOfCastlingWhiteCells,
        [Colors.BLACK]: this.listOfCastlingBlackCells
    }

    checkWhiteCastlingRightRook = computed(() => !this.whiteState().rightRookFirstMoved && !this.whiteState().kingFirstMoved && !this.whiteState().madeCastling)
    checkWhiteCastlingLeftRook = computed(() => !this.whiteState().leftRookFirstMoved && !this.whiteState().kingFirstMoved && !this.whiteState().madeCastling)

    checkBlackCastlingRightRook = computed(() => !this.blackState().rightRookFirstMoved && !this.blackState().kingFirstMoved && !this.blackState().madeCastling)
    checkBlackCastlingLeftRook = computed(() => !this.blackState().leftRookFirstMoved && !this.blackState().kingFirstMoved && !this.blackState().madeCastling)

    kingsCastling = {
        [Colors.WHITE+this.castlingCells[Colors.WHITE][0].king.i+this.castlingCells[Colors.WHITE][0].king.j]: this.checkWhiteCastlingRightRook,
        [Colors.WHITE+this.castlingCells[Colors.WHITE][1].king.i+this.castlingCells[Colors.WHITE][1].king.j]: this.checkWhiteCastlingLeftRook,
        [Colors.BLACK+this.castlingCells[Colors.BLACK][0].king.i+this.castlingCells[Colors.BLACK][0].king.j]: this.checkBlackCastlingLeftRook,
        [Colors.BLACK+this.castlingCells[Colors.BLACK][1].king.i+this.castlingCells[Colors.BLACK][1].king.j]: this.checkBlackCastlingRightRook,
    }

    constructor() {
    }


    updateRookState(color: Colors, side: string) {
        switch (color) {
            case Colors.WHITE:
                if(side === 'left') {
                    this.whiteState.update(state => ({...state, leftRookFirstMoved: true}))
                } else {
                    this.whiteState.update(state => ({...state, rightRookFirstMoved: true}))
                }
                break;
            case Colors.BLACK:
                if(side === 'left') {
                    this.blackState.update(state => ({...state, leftRookFirstMoved: true}))
                } else {
                    this.blackState.update(state => ({...state, rightRookFirstMoved: true}))
                }
                break;
        }
    }
}
