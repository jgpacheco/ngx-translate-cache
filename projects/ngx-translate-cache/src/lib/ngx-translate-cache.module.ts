import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateCacheConfig, CACHE_NAME, CACHE_MECHANISM, COOKIE_EXPIRY,
  TranslateCacheSettings } from './ngx-translate-cache.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: []
})
export class TranslateCacheModule {
  static forRoot(config: TranslateCacheConfig): ModuleWithProviders<TranslateCacheModule> {
    return {
      ngModule: TranslateCacheModule,
      providers: [
        { provide: CACHE_NAME, useValue: config.cacheName },
        { provide: CACHE_MECHANISM, useValue: config.cacheMechanism },
        { provide: COOKIE_EXPIRY, useValue: config.cookieExpiry },
        TranslateCacheSettings,
        config.cacheService,
      ]
    };
  }
}
