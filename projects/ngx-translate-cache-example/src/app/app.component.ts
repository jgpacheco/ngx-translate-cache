import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-translate-cache-example';

  constructor(translateService: TranslateService, translateCacheService: TranslateCacheService) {
    translateService.setDefaultLang('es');
    translateCacheService.init();
  }
}
