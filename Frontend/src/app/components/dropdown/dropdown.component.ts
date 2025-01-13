import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, NgModule, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClientService } from '../../services/client.service';

export interface ClientOption {
  clientName: string;
  Address: string;
  _id: string;
  clientContactPerson: string;
  clientEmail: string;
  clientPhone: string;
  clientGeoLocation: { type: string; coordinates: number[] };
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  @Input() show: boolean = false;
  @Input() options: ClientOption[] = []; // Aseguramos que las opciones son de tipo ClientOption[]
  @Output() optionSelected = new EventEmitter<ClientOption>();
  @Output() searchChanged = new EventEmitter<string>();

  private _value: ClientOption | null = null; // Cambio a ClientOption o null
  get value(): ClientOption | null {
    return this._value;
  }
  set value(val: ClientOption | null) {
    this._value = val;
    this.onChange(val); // Actualizamos la función de cambio
    this.onTouched();
  }

  // Funciones para propagar cambios
  onChange: (value: ClientOption | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: ClientOption | null): void {
    this.value = value || null; // Si no se pasa valor, se coloca null
  }

  registerOnChange(fn: (value: ClientOption | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(value: string): void {
    this.searchChanged.emit(value);
    this.show = true;
  }

  selectOption(option: ClientOption): void {
    this.value = option; // Ahora 'value' es el objeto completo de tipo ClientOption
    this.show = false;
    this.optionSelected.emit(option);
  }

  onInputFocus(): void {
    this.show = true;
    if (!this.value) {
      this.searchChanged.emit('');
    }
  }
}
