import {Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appCellAttackCircle]'
})
export class CellAttackCircleDirective implements OnChanges {

  @Input() attack: boolean = false

  constructor(
      private element: ElementRef,
      private renderer: Renderer2,
  ) { }

  ngOnChanges(changes:SimpleChanges) {
    const attackVal = changes['attack']
    if (attackVal.previousValue === attackVal.currentValue) return
    if(this.attack) {
      this.renderer.addClass(this.element.nativeElement, 'attack-circle')
    }
  }
}
