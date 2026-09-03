import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [RouterLink, FadeInDirective],
  templateUrl: './process.component.html',
  styleUrl: './process.component.css'
})
export class ProcessComponent {}
