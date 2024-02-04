import {Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appCellDot]'
})
export class CellDotDirective implements OnChanges {

  @Input() active: boolean = false

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnChanges(changes:SimpleChanges) {
    const activeVal = changes['active']
    if(activeVal.previousValue === activeVal.currentValue) return
    if(this.active) {
      this.renderer.addClass(this.element.nativeElement, 'dot')
    }
  }

}
