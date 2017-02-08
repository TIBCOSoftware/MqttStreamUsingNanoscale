var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { ovenstatusData } from './ovenstatusData';
var MqttService = MqttService_1 = (function () {
    function MqttService(ajax) {
        this.overrideLocal = false;
        this.channel = "temp_stream";
        this.UpdateSource = new Subject();
        this.publishUpdated$ = this.UpdateSource.asObservable();
        //http:Http;
        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.http = ajax;
    }
    MqttService.prototype.connect = function (host, port, username, password) {
        var self = this;
        //this.gateway = new Gateway({url: {protocol:'mqtt:',hostname:host,port:port},username:username,password:password});
        this.gateway = new Gateway({ url: { protocol: 'mqtt:', hostname: host, path: "/mqtt" }, username: username, password: password });
        // Create an MQTT client instance.  Client connects automatically.
        this.client = this.gateway.mqtt();
        // Interact with the MQTT client as described in the MQTT documentation.
        this.client.on('connect', function () {
            debugger;
            console.log("subscribe to a channel");
            self.client.subscribe('/' + self.channel);
            //self.client.publish('temp_stream', 'Hello mqtt');
        });
        this.client.on('message', function (topic, message, msg) {
            // message is Buffer
            console.log(message.toString());
            var lMessage = JSON.parse(message.toString());
            self.UpdateSource.next(parseInt(lMessage.temp));
        });
    };
    MqttService.prototype.unsubscribeMqtt = function () {
        this.client.unsubscribe('/' + temp_stream, ');, this.UpdateSource.next(0));
    };
    /**********************************************************************/
    /**********MQTT using Paho opensource Javscript SDK for MQTT********/
    MqttService.prototype.connectPaho = function (host, port, username, password) {
        debugger;
        // Create a client instance
        MqttService_1.pahoClient = new Paho.MQTT.Client(host, port, "clientId");
        // set callback handlers
        MqttService_1.pahoClient.onConnectionLost = this.onConnectionLost;
        MqttService_1.pahoClient.onMessageArrived = this.onMessageArrived;
        // connect the client
        MqttService_1.pahoClient.connect({ userName: username, password: password, onSuccess: this.onConnect });
        // called when the client connects
    };
    MqttService.prototype.onConnect = function () {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        MqttService_1.pahoClient.subscribe("/temp_stream");
        //let message = new Paho.MQTT.Message("Hello");
        //message.destinationName = "World";
        //MqttService.pahoClient.send(message);
    };
    // called when the client loses its connection
    MqttService.prototype.onConnectionLost = function (responseObject) {
        debugger;
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    };
    // called when a message arrives
    MqttService.prototype.onMessageArrived = function (message) {
        debugger;
        console.log("onMessageArrived:" + message.payloadString);
        var lMessage = JSON.parse(message.payloadString);
        this.publishUpdateSource.next(lMessage.temp);
    };
    /***************end of Paho javascript SDK Code*************************/
    /**********************************************************************/
    MqttService.prototype.connectAndStream = function (host, username, password, min, max, serial, model, timeInterval) {
        var self = this;
        debugger;
        //this.gateway = new Gateway({url: {protocol:'mqtt:',hostname:host,port:port},username:username,password:password});
        this.gateway = new Gateway({ url: { protocol: 'mqtt:', hostname: host, path: "/mqtt" }, username: username, password: password });
        // Create an MQTT client instance.  Client connects automatically.
        this.client = this.gateway.mqtt();
        this.gateway.cache(false);
        // Interact with the MQTT client as described in the MQTT documentation.
        this.client.on('connect', function () {
            debugger;
            console.log("subscribe to a channel");
            self.client.subscribe('temp_stream');
            self.interval = setInterval(function () {
                debugger;
                var num = Math.floor(Math.random() * (max - min + 1)) + min;
                var data = new ovenstatusData().deserialize({ "channel": "temp_stream", "message": "{\"serial\":\"" + serial + "\",\"temp\":\"" + num + "\",\"model\":\"" + model + "\"}" });
                self.client.publish('temp_stream', JSON.stringify({ "serial": "\"" + serial + "\"", "temp": "\"" + num + "\"", "model": "\"" + model + "\"" }));
            }, timeInterval);
        });
        this.client.on('message', function (topic, message) {
            // message is Buffer
            console.log(message.toString());
            clearInterval(self.interval);
            self.client.end();
        });
    };
    MqttService.prototype.stopStream = function () {
        clearInterval(this.interval);
        if (this.client) {
            this.client.end();
        }
        this.random_value = 0;
        this.UpdateSource.next(this.random_value);
    };
    MqttService.prototype.streamNumbers = function (host, min, max, serial, model, timeInterval) {
        var _this = this;
        var self = this;
        this.interval = setInterval(function () {
            if (!self.overrideLocal) {
                self.random_value = Math.floor(Math.random() * (max - min + 1)) + min;
            }
            else {
                self.random_value = 220;
                self.overrideLocal = false;
            }
            _this.UpdateSource.next(self.random_value);
            var data = new ovenstatusData().deserialize({ "channel": "temp_stream", "message": "{\"serial\":\"" + serial + "\",\"temp\":\"" + self.random_value + "\",\"model\":\"" + model + "\"}" });
            //let bodyString = JSON.stringify({"channel": "temp_stream","message":"{\"serial\":\""+serial+"\",\"temp\":\""+num+"\",\"model\":\""+model+"\"}"}); // Stringify payload
            var bodyString = JSON.stringify(data);
            var headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
            var options = new RequestOptions({ headers: headers }); // Create a request option
            var PostRequest = _this.http.post(host.href + "send_push", bodyString, options) // ...using post request
                .map(function (res) {
                //console.log(res.json());
            }) // ...and calling .json() on the response to return data
                .catch(function (error) { return Observable.throw(error.json().error || 'Server error'); }); //...errors if a
            PostRequest.subscribe(function (response) {
                // Emit list event
                console.log(response);
            }, function (err) {
                // Log errors if any
                console.log(err);
            });
        }, timeInterval);
    };
    return MqttService;
}());
MqttService = MqttService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], MqttService);
export { MqttService };
var MqttService_1;
//# sourceMappingURL=mqtt-service.js.map