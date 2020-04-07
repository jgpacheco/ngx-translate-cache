# ngx-translate-cache
[![NPM version][npm-version-image]][npm-url]
[![MIT License][license-image]][license-url]

Based on and extension of [ngx-translate][ngx-translate-url].
This is basically a simplified version of [localize-router][localize-router-url].
If you are already using *localize-router* you don't need this extension.
This extension is aimed only to facilitate language cache with *ngx-translate*.

| Angular version | Integration branch | Library version |
|:---------------:|:------------------:|:---------------:|
|   8 and below   |     angular1-8     |      ^0.0.0     |
|        9        |       master       |      ^9.0.0     |

## Installation

To install this library, run:

```bash
$ npm install ngx-translate-cache --save
```

## Usage

```typescript
    import { TranslateModule, TranslateService } from '@ngx-translate/core';
    import { TranslateCacheModule, TranslateCacheSettings, TranslateCacheService } from 'ngx-translate-cache';

    @NgModule({
        imports: [
            TranslateModule.forRoot(),
            TranslateCacheModule.forRoot({
              cacheService: {
                provide: TranslateCacheService,
                useFactory: (translateService, translateCacheSettings) => {
                    return new TranslateCacheService(translateService, translateCacheSettings)
                },
                deps: [ TranslateService, TranslateCacheSettings ]
              }
            })
        ],
        ...
    })
    export class AppModule {}
```

### AoT

If you are using AoT [AoT compilation][aot-compiler-url]
or [Ionic][ionic-url], you must use an exported function instead of an inline function.

```ts
    import { TranslateModule, TranslateService } from '@ngx-translate/core';
    import { TranslateCacheModule, TranslateCacheSettings, TranslateCacheService } from 'ngx-translate-cache';

    export function TranslateCacheFactory(translateService, translateCacheSettings) {
      return new TranslateCacheService(translateService, translateCacheSettings);
    }

    @NgModule({
        imports: [
            TranslateModule.forRoot(),
            TranslateCacheModule.forRoot({
              cacheService: {
                provide: TranslateCacheService,
                useFactory: TranslateCacheFactory,
                deps: [ TranslateService, TranslateCacheSettings ]
              }
            })
        ],
        ...
    })
    export class AppModule {}
```

### Initializing

To initialize *ngx-translate* you usually do

```typescript
    import { Component } from '@angular/core';
    import { TranslateService } from '@ngx-translate/core';

    @Component({
        selector: 'app',
        template: `
            <div>{{ 'HELLO' | translate }}</div>
        `
    })
    export class AppComponent {

        constructor(translateService: TranslateService) {
            translateService.setDefaultLang('en');
            translateService.use('en');
        }
    }
```

To initialize *ngx-translate* with *ngx-translate-cache*

```typescript
    import { Component } from '@angular/core';
    import { TranslateService } from '@ngx-translate/core';
    import { TranslateCacheService } from 'ngx-translate-cache';

    @Component({
        selector: 'app',
        template: `
            <div>{{ 'HELLO' | translate }}</div>
        `
    })
    export class AppComponent {

        constructor(translateService: TranslateService,
                    translateCacheService: TranslateCacheService) {
            translateService.setDefaultLang('en');
            translateCacheService.init();
        }
    }
```

`init` method will subscribe to `translateService.onLangChange` event and update the cached language accordingly.

It also instruct *ngx-translate* to use the previous cached language if defined, or the browser current language if defined.

The order of precedence is as described below:

    1. Cached language.
    2. Current language of the browser.
    3. Default language (language used as a fallback for *ngx-translate*).

You can also define the cache mechanism used (`LocalStorage` or `Cookie`), key used to store cached value and
cookie duration (defined in hours).

```typescript
    import { TranslateModule, TranslateService } from '@ngx-translate/core';
    import { TranslateCacheModule, TranslateCacheSettings, TranslateCacheService } from 'ngx-translate-cache';

    @NgModule({
        imports: [
            TranslateModule.forRoot(),
            TranslateCacheModule.forRoot({
              cacheService: {
                provide: TranslateCacheService,
                useFactory: (translateService, translateCacheSettings) => {
                    return new TranslateCacheService(translateService, translateCacheSettings)
                },
                deps: [ TranslateService, TranslateCacheSettings ]
              },
              cacheName: 'mylang', // default value is 'lang'.
              cacheMechanism: 'Cookie', // default value is 'LocalStorage'.
              cookieExpiry: 1, // default value is 720, a month.
            })
        ],
        ...
    })
    export class AppModule {}
```

## License

MIT © [Jaime](mailto:jaime.glez.pacheco@gmail.com)

[npm-url]: https://www.npmjs.com/package/ngx-translate-cache
[npm-version-image]: https://img.shields.io/npm/v/npm.svg?style=flat

[license-image]: https://img.shields.io/npm/l/express.svg?style=flat
[license-url]: LICENSE

[ngx-translate-url]: https://github.com/ngx-translate/core
[localize-router-url]: https://github.com/Greentube/localize-router
[aot-compiler-url]: https://angular.io/docs/ts/latest/cookbook/aot-compiler.html
[ionic-url]: http://ionic.io/
