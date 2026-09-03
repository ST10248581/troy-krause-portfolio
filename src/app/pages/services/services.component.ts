import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, FadeInDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {}
