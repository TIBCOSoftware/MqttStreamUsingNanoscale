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
import { iosService } from '../../ios-service';
var HomePage = (function () {
    function HomePage(navCtrl, mqttService, iosService) {
        this.navCtrl = navCtrl;
        this.mqttService = mqttService;
        this.iosService = iosService;
        this.url = "https://perfect-whip-5690.staging.nanoscaleapi.io";
        this.serial = "";
        this.model = "";
        this.warmth = { lower: 100, upper: 160 };
        this.timeinterval = 1;
        this.disableStream = false;
    }
    //this will work when web socket support gets enabled
    HomePage.prototype.connectToMqtt = function () {
        var host = "perfect-whip-5690.staging.nanoscaleapi.io";
        //var host="https://perfect-whip-5690.staging.nanoscaleapi.io";
        //var host="accessible-car-9624.lvh.me"
        var port = 1883;
        //var port:Number =5000;
        //var username:String="shassan@anypresence.com,PushNotificationAPI,push,mqtt_msg";
        //var username:String="shassan@anypresence.com,PushNotificationAPI,pushRemoteEndpoint,mqtt";
        var username = "shassan@anypresence.com,MQTTStreaming,push,MQTT";
        var password = "password";
        this.mqttService.connect(host, port, username, password);
        console.log('connect to mqtt is called');
    };
    HomePage.prototype.pahoConnectToMqtt = function () {
        //var host="ceaseless-trains-4183.staging.nanoscaleapi.io";
        var host = "perfect-whip-5690.staging.nanoscaleapi.io";
        //var host="accessible-car-9624.lvh.me"
        var port = 1883;
        //var port:Number =5000;
        //var username:String="shassan@anypresence.com,PushNotificationAPI,push,mqtt_msg";
        var username = "shassan@anypresence.com,MQTTStreaming,push,MQTT";
        //var username:String="developer@example.net,PushMessageSocketsAPI,push,mqtt";
        //var username:String="developer@example.net,PushMessageSocketsAPI,push,mqtt"
        var password = "password";
        this.mqttService.connectPaho(host, port, username, password);
    };
    HomePage.prototype.subscribeIOS = function () {
        var host = "https://ceaseless-trains-4183.staging.nanoscaleapi.io/push/pushRemoteEndpoint";
        this.iosService.subscribe(host);
        console.log('connect to mqtt is called');
    };
    HomePage.prototype.unsubscribeIOS = function () {
        var host = "https://ceaseless-trains-4183.staging.nanoscaleapi.io/push/pushRemoteEndpoint";
        this.iosService.unsubscribe(host);
        console.log('connect to mqtt is called');
    };
    HomePage.prototype.publishIOS = function () {
        var host = "https://ceaseless-trains-4183.staging.nanoscaleapi.io";
        this.iosService.publish(host);
        console.log('connect to mqtt is called');
    };
    HomePage.prototype.restrictNumeric = function (e) {
        var input;
        if (e.metaKey || e.ctrlKey) {
            return true;
        }
        if (e.which === 32) {
            return false;
        }
        if (e.which === 0) {
            return true;
        }
        if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d\s]/.test(input);
    };
    HomePage.prototype.streamTemperature = function () {
        /*let host= "perfect-whip-5690.staging.nanoscaleapi.io";
        let username="shassan@anypresence.com,MQTTStreaming,push,MQTT";
        let password="password";
        
        this.mqttService.connectAndStream(host,username,password,this.warmth.lower,this.warmth.upper,this.serial,this.model,this.timeinterval*1000)*/
        var host = new URL(this.url);
        this.mqttService.streamNumbers(host, this.warmth.lower, this.warmth.upper, this.serial, this.model, this.timeinterval * 1000);
        this.disableStream = true;
    };
    HomePage.prototype.stopStreaming = function () {
        this.disableStream = false;
        this.mqttService.stopStream();
    };
    HomePage.prototype.RedLineCrossed = function () {
        this.mqttService.overrideLocal = true;
    };
    return HomePage;
}());
__decorate([
    Input(),
    __metadata("design:type", String)
], HomePage.prototype, "url", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], HomePage.prototype, "serial", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], HomePage.prototype, "model", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], HomePage.prototype, "warmth", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], HomePage.prototype, "timeinterval", void 0);
HomePage = __decorate([
    Component({
        selector: 'page-home',
        templateUrl: 'home.html',
        providers: [iosService]
    }),
    __metadata("design:paramtypes", [NavController, MqttService, iosService])
], HomePage);
export { HomePage };
//# sourceMappingURL=home.js.map