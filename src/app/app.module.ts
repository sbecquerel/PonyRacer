import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';

// Services
import { UserService } from './user.service';
import { JwtInterceptorService } from './jwt-interceptor.service';
import { WsService } from './ws.service';
import { LoggedInGuard } from './logged-in.guard';

// Routes
import { RouterModule, PreloadAllModules } from '@angular/router';
import { ROUTES } from './app.routes';

import { WEBSOCKET, WEBSTOMP } from './app.tokens';
import * as Webstomp from 'webstomp-client';

export function webSocketFactory() {
  return WebSocket;
}

export function webstompFactory() {
  return Webstomp;
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }),
    NgbModule.forRoot()
  ],
  providers: [
    UserService,
    JwtInterceptorService,
    { provide: HTTP_INTERCEPTORS, useExisting: JwtInterceptorService, multi: true },
    WsService,
    { provide: WEBSOCKET, useFactory: webSocketFactory },
    { provide: WEBSTOMP, useFactory: webstompFactory },
    LoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
