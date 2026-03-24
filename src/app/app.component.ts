import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'Codes-Labs';

  constructor() {
    const analytics = inject(AnalyticsService);
    const router = inject(Router);

    analytics.init(environment.googleAnalyticsMeasurementId, environment.metaPixelId);

    router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((e) => analytics.trackPageView(e.urlAfterRedirects));
  }
}
