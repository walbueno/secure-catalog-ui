import { importProvidersFrom } from "@angular/core";

import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./app/core/interceptors/auth.interceptor";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { AppRoutingModule } from "./app/app-routing.module";
import { AppComponent } from "./app/app.component";


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule),
        provideHttpClient(withInterceptors([authInterceptor]))
    ]
})
  .catch(err => console.error(err));
