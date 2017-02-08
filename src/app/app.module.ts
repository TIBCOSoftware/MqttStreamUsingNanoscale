import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { GaugePage } from '../pages/gauge/gauge';
import { MqttService } from '../mqtt-service';
import { jqxGaugeComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgauge';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    GaugePage,
    TabsPage,
    jqxGaugeComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
    //HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    GaugePage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},MqttService]
})
export class AppModule {}
