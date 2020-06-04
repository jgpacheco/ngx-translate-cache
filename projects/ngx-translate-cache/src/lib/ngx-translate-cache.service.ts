import { Inject, Injectable, InjectionToken, Provider } from '@angular/core';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';

export type CacheMechanismType = 'LocalStorage' | 'Cookie';
export namespace CacheMechanism {
  export const LocalStorage: CacheMechanismType = 'LocalStorage';
  export const Cookie: CacheMechanismType = 'Cookie';
}

export const CACHE_NAME = new InjectionToken<string>('CACHE_NAME');
export const CACHE_MECHANISM = new InjectionToken<string>('CACHE_MECHANISM');
export const COOKIE_EXPIRY = new InjectionToken<string>('COOKIE_EXPIRY');
export const COOKIE_ATTRIBUTES = new InjectionToken<string>('COOKIE_ATTRIBUTES');
export const COOKIE_EXPIRE_SESSION = -1;

export interface TranslateCacheConfig {
  cacheService: Provider;
  cacheName?: string;
  cacheMechanism?: CacheMechanismType;
  cookieExpiry?: number;
  cookieAttributes?: string;
}

const DEFAULT_CACHE_NAME = 'lang';
const DEFAULT_CACHE_MECHANISM = CacheMechanism.LocalStorage;
const DEFAULT_COOKIE_EXPIRY = 720;

@Injectable()
export class TranslateCacheSettings {
  constructor(@Inject(CACHE_NAME) public cacheName: string = DEFAULT_CACHE_NAME,
              @Inject(CACHE_MECHANISM) public cacheMechanism: string = DEFAULT_CACHE_MECHANISM,
              @Inject(COOKIE_EXPIRY) public cookieExpiry: number = DEFAULT_COOKIE_EXPIRY,
              @Inject(COOKIE_ATTRIBUTES) public cookieAttributes: string) {}
}

/* Not injectable */
export class TranslateCacheService {
  constructor(private translateService: TranslateService,
              private translateCacheSettings: TranslateCacheSettings) {}

  public init(): void {
    this.translateService.onLangChange
      .subscribe((event: TranslationChangeEvent) => {
        if (this.translateCacheSettings.cacheMechanism === CacheMechanism.LocalStorage) {
          return this.cacheWithLocalStorage(event.lang);
        }

        if (this.translateCacheSettings.cacheMechanism === CacheMechanism.Cookie) {
          return this.cacheWithCookies(event.lang);
        }
      });

    const currentLang = this.getCachedLanguage() || this.translateService.getBrowserLang();

    if (currentLang) { this.translateService.use(currentLang); }
  }

  public getCachedLanguage(): string {
    if (this.translateCacheSettings.cacheMechanism === CacheMechanism.LocalStorage) {
      return this.cacheWithLocalStorage();
    }

    if (this.translateCacheSettings.cacheMechanism === CacheMechanism.Cookie) {
      return this.cacheWithCookies();
    }
  }

  private cacheWithLocalStorage(value?: string): string {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') { return; }

    try {
      if (value) { window.localStorage.setItem(this.translateCacheSettings.cacheName, value); return; }

      return window.localStorage.getItem(this.translateCacheSettings.cacheName);
    } catch (e) { return; }
  }

  private cacheWithCookies(value?: string): string {
    if (typeof document === 'undefined' || typeof document.cookie === 'undefined') { return; }

    try {
      const name = encodeURIComponent(this.translateCacheSettings.cacheName);

      if (value) {
        let cookieString = `${name}=${encodeURIComponent(value)}`;

        if (this.translateCacheSettings.cookieExpiry !== COOKIE_EXPIRE_SESSION) {
          const date: Date = new Date();

          date.setTime(date.getTime() + this.translateCacheSettings.cookieExpiry * 3600000);
          cookieString += `;expires=${date.toUTCString()}`;
        }

        if (this.translateCacheSettings.cookieAttributes) {
          cookieString += ';' + this.translateCacheSettings.cookieAttributes;
        }

        document.cookie = cookieString;

        return;
      }
      const regexp = new RegExp('(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)', 'g');
      const result = regexp.exec(document.cookie);

      return decodeURIComponent(result[1]);
    } catch (e) { return; }
  }
}
