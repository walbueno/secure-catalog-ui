import { provideZoneChangeDetection, importProvidersFrom } from "@angular/core";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { AuthInterceptor } from "./app/core/interceptors/auth.interceptor";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { AppRoutingModule } from "./app/app-routing.module";
import { AppComponent } from "./app/app.component";


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
