import {Directive, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';

@Directive({
  selector: '[appCellAttackCircle]'
})
export class CellAttackCircleDirective implements OnChanges {

  @Input() attack: boolean = false

  constructor(
      private element: ElementRef,
      private renderer: Renderer2,
  ) { }

  ngOnChanges() {
    if(this.attack) {
      this.renderer.addClass(this.element.nativeElement, 'attack-circle')
    }
  }
}
