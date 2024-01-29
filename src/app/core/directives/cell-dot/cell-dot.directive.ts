import {Directive, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';

@Directive({
  selector: '[appCellDot]'
})
export class CellDotDirective implements OnChanges {

  @Input() active: boolean = false

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnChanges() {
    if(this.active) {
      this.renderer.addClass(this.element.nativeElement, 'dot')
    }
  }

}
