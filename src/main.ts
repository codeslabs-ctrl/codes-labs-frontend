import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { Sparkles, ArrowRight, BarChart3, Bot, Rocket, Activity, Target, Lightbulb, Award, Loader2, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-angular';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(LucideAngularModule.pick({
      Sparkles,
      ArrowRight,
      ArrowLeft,
      BarChart3,
      Bot,
      Rocket,
      Activity,
      Target,
      Lightbulb,
      Award,
      Loader2,
      Send,
      CheckCircle,
      AlertCircle
    }))
  ]
}).catch(err => console.error(err));
