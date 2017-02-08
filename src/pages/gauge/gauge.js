var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { jqxGaugeComponent } from '../../../jqwidgets-ts/angular_jqxgauge';
import { MqttService } from '../../mqtt-service';
/*
  Generated class for the Gauge page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var GaugePage = (function () {
    function GaugePage(navCtrl, mqttService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.mqttService = mqttService;
        this.ticksMinor = { interval: 5, size: '5%' };
        this.ticksMajor = { interval: 10, size: '9%' };
        this.ranges = [
            { startValue: 0, endValue: 55, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 5, startWidth: 1 },
            { startValue: 55, endValue: 110, style: { fill: '#fbd109', stroke: '#fbd109' }, endWidth: 10, startWidth: 5 },
            { startValue: 110, endValue: 165, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 13, startWidth: 10 },
            { startValue: 165, endValue: 220, style: { fill: '#e02629', stroke: '#e02629' }, endWidth: 16, startWidth: 13 }
        ];
        mqttService.publishUpdated$.subscribe(function (rand_num) {
            debugger;
            _this.myGauge.value(rand_num);
        });
    }
    GaugePage.prototype.ionViewDidLoad = function () {
        debugger;
        console.log('Hello GaugePage Page');
    };
    GaugePage.prototype.ngAfterViewInit = function () {
        var _this = this;
        var self = this;
        setTimeout(function () {
            _this.myGauge.value(0);
        });
    };
    GaugePage.prototype.gaugeOnValueChanging = function (event) {
        var gaugeValueDom = document.getElementById('gaugeValue');
        gaugeValueDom.innerHTML = Math.round(event.args.value) + ' &#8457;';
    };
    return GaugePage;
}());
__decorate([
    ViewChild('gaugeReference'),
    __metadata("design:type", jqxGaugeComponent)
], GaugePage.prototype, "myGauge", void 0);
GaugePage = __decorate([
    Component({
        //selector: 'page-gauge',
        //templateUrl: 'gauge.html'
        selector: 'gauge',
        template: "\n        <jqxGauge #gaugeReference (onValueChanging)=\"gaugeOnValueChanging($event)\"\n            [ranges]='ranges' [ticksMinor]='ticksMinor' [ticksMajor]='ticksMajor'\n            [value]='0' [colorScheme]='\"scheme05\"' [animationDuration]='1200'>\n        </jqxGauge>\n        <div id=\"gaugeValue\"\n            style=\"position: absolute; top: -140px; left: 124px; font-family: Sans-Serif; text-align: center; font-size: 17px; width: 100px;\">\n        </div>" //,
    }),
    __metadata("design:paramtypes", [NavController, MqttService])
], GaugePage);
export { GaugePage };
//# sourceMappingURL=gauge.js.map