import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {Colors} from "../../types/cell-type";
import {ChooseElementService} from "../../services/choose-element.service";
import {FigureInfo} from "../../types/figure-info";
import {ChessBoardService} from "../../services/chess-board.service";
import {PlayerService} from "../../services/player.service";

@Directive({
  selector: '[appCellColor]'
})
export class CellColorDirective implements OnInit {

  @Input() color!: Colors

  @Input() cellInfo!: Partial<FigureInfo> | null

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private chooseService: ChooseElementService,
    private boardService: ChessBoardService,
    private playerService: PlayerService
    ) { }

  ngOnInit() {
    this.renderer.addClass(this.element.nativeElement, this.color)
    this.chooseService.choose$.subscribe((info) => {
      if(info?.id === this.cellInfo?.id && this.cellInfo !== null) {
        this.renderer.removeClass(this.element.nativeElement, this.color)
        this.renderer.setStyle(this.element.nativeElement, 'background-color', '#bbcc43')
      } else {
        this.renderer.removeStyle(this.element.nativeElement, 'background-color')
        this.renderer.addClass(this.element.nativeElement, this.color)
      }
    })
  }

  @HostListener('click') setColor() {
    if(!this.cellInfo || this.cellInfo?.color === this.playerService.enemyColor) return
    const coordinates = this.boardService.getCoordinatesById(this.cellInfo!.id!)
    if(this.boardService.board[coordinates.i][coordinates.j].figure) {
      this.chooseService.choose$.next(this.cellInfo as FigureInfo)
    }
  }
}
