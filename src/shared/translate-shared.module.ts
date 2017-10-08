import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
  }

@NgModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [Http]
            }
          }),
    ],
    exports:[
        TranslateModule
    ]
})
export class TranslateSharedModule {}