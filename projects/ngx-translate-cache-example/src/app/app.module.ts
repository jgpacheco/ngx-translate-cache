import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateCacheModule, TranslateCacheSettings, TranslateCacheService } from 'ngx-translate-cache';

import { AppComponent } from './app.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

export function TranslateCacheFactory(translateService, translateCacheSettings) {
    return new TranslateCacheService(translateService, translateCacheSettings);
}

@NgModule({
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        TranslateCacheModule.forRoot({
            cacheService: {
                provide: TranslateCacheService,
                useFactory: TranslateCacheFactory,
                deps: [TranslateService, TranslateCacheSettings]
            }
        })], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
