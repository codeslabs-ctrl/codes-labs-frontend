import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterModule, LucideAngularModule],
  templateUrl: './privacy-policy.component.html',
  styles: []
})
export class PrivacyPolicyComponent {}
