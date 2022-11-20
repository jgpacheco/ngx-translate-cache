import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ngx-translate-cache-example';
  languages = [
    'es',
    'en',
    'it',
  ];
  languageCtrl: FormControl;

  private DEFAULT_LANG = 'es';
  private languageSubscription: Subscription;

  constructor(private translateService: TranslateService, translateCacheService: TranslateCacheService) {
    translateService.addLangs(this.languages);
    translateService.setDefaultLang(translateCacheService.getCachedLanguage() || this.DEFAULT_LANG);
    translateCacheService.init();
  }

  ngOnInit() {
    this.languageCtrl = new FormControl(this.translateService.currentLang || this.translateService.defaultLang);
    this.languageSubscription = this.languageCtrl.valueChanges.subscribe(language => {
      this.translateService.use(language);
    })
  }

  ngOnDestroy() {
    this.languageSubscription?.unsubscribe();
  }
}
