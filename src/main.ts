import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ApplicationModule } from './application/application.module';


platformBrowserDynamic().bootstrapModule(ApplicationModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
