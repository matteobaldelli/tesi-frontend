import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appLowercase]'
})
export class LowercaseDirective {
  @HostListener('input', ['$event']) onEvent() {
    const upper = this.el.nativeElement.value.toLowerCase();
    this.control.control.setValue(upper);
  }

  constructor(private el: ElementRef, private control: NgControl) {
  }
}
