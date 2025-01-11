import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, input, NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',


providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownComponent),
    multi: true,
  }
]
})
export class DropdownComponent implements ControlValueAccessor{
@Input() options!:string []
@Input() show:boolean=false;
private _value="";
get value(): string{
  return this._value
}
set value(val:string){
  this._value=val
  this.onChange(val)
  this.onTouched()
}
  // Función para propagar cambios
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }

}
