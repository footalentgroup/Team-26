import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loadingspiner',
  standalone: true,
  imports: [],
  templateUrl: './loadingspiner.component.html',
  styleUrl: './loadingspiner.component.css'
})
export class LoadingspinerComponent {
  @Input() isLoading: boolean = false;  // Controla la visibilidad del modal
}
