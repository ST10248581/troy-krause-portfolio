import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FadeInDirective } from '../../shared/directives/fade-in.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, FadeInDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  sendEnquiry(): void {
    const link = document.createElement('a');
    link.href = 'mailto:troyrause07@gmail.com?subject=Project%20Enquiry&body=Hi%20Troy%2C%0A%0AI%20have%20a%20project%20I%27d%20like%20to%20discuss.%0A%0AThe%20problem%20I%27m%20trying%20to%20solve%3A%0A%0AWho%20it%27s%20for%3A%0A%0AAny%20ideas%20or%20requirements%3A%0A%0AThanks!';
    link.click();
  }
}
