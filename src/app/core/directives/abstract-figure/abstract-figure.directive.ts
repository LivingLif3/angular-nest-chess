import {Directive, Input} from '@angular/core';
import {Colors} from "../../types/cell-type";
import {FigureInfo} from "../../types/figure-info";
import {ChessBoardService} from "../../services/chess-board.service";
import {ChooseElementService} from "../../services/choose-element.service";
import {BitBoardService} from "../../services/bit-board.service";
import {CastlingService} from "../../services/castling.service";

@Directive({
  selector: '[appAbstractFigure]'
})
export abstract class AbstractFigureDirective {

  @Input()
  color!: Colors

  @Input()
  figure!: Partial<FigureInfo>

  imgPath: string = ''

  constructor(
      boardService: ChessBoardService,
      chooseService: ChooseElementService,
      bitBoardService: BitBoardService,
      castlingService?: CastlingService
  ) { }

  abstract showDots(count?: number): void

}
