var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MqttService } from '../../mqtt-service';
var AboutPage = (function () {
    function AboutPage(navCtrl, mqttService) {
        this.navCtrl = navCtrl;
        this.mqttService = mqttService;
        //my default url, dont add https it uses websockets
        this.url = "perfect-whip-5690.staging.nanoscaleapi.io";
        this.username = "";
        this.password = "";
    }
    //connects and subscribes to Mqtt
    AboutPage.prototype.connectToMqtt = function () {
        var host = "perfect-whip-5690.staging.nanoscaleapi.io";
        var port = 1883;
        var username = this.username; //"shassan@anypresence.com,MQTTStreaming,push,MQTT";
        var password = this.password; //"password";
        this.mqttService.connect(this.url, port, this.username, this.password);
        //this.mqttService.connectPaho(host,port,username,password);
        console.log('connect to mqtt is called');
    };
    //unsubscribes Mqtt
    AboutPage.prototype.unSubscribeMqtt = function () {
        this.mqttService.unSubscribe();
    };
    return AboutPage;
}());
__decorate([
    Input(),
    __metadata("design:type", String)
], AboutPage.prototype, "url", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], AboutPage.prototype, "username", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], AboutPage.prototype, "password", void 0);
AboutPage = __decorate([
    Component({
        selector: 'page-about',
        templateUrl: 'about.html'
    }),
    __metadata("design:paramtypes", [NavController, MqttService])
], AboutPage);
export { AboutPage };
//# sourceMappingURL=about.js.map