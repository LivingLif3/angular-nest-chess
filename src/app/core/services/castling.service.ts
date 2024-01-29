import {computed, Injectable, signal} from '@angular/core';

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

    checkWhiteCastlingRightRook = computed(() => !this.whiteState().rightRookFirstMoved && !this.whiteState().kingFirstMoved && !this.whiteState().madeCastling)
    checkWhiteCastlingLeftRook = computed(() => !this.whiteState().leftRookFirstMoved && !this.whiteState().kingFirstMoved && !this.whiteState().madeCastling)

    checkBlackCastlingRightRook = computed(() => !this.blackState().rightRookFirstMoved && !this.blackState().kingFirstMoved && !this.blackState().madeCastling)
    checkBlackCastlingLeftRook = computed(() => !this.blackState().leftRookFirstMoved && !this.blackState().kingFirstMoved && !this.blackState().madeCastling)

    constructor() {
    }

}
