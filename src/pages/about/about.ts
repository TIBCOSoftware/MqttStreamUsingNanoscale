import { Component ,Input} from '@angular/core';

import { NavController } from 'ionic-angular';
import {MqttService} from '../../mqtt-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
	//my default url, dont add https it uses websockets
  @Input() url:string="perfect-whip-5690.staging.nanoscaleapi.io";
  @Input() username:string="shassan@anypresence.com,MQTTStreaming,push,MQTT";
  @Input() password:string="password";
  constructor(public navCtrl: NavController,private mqttService:MqttService) {

  }

  //connects and subscribes to Mqtt
  connectToMqtt():void{
  	let port:number =1883;
    
  	this.mqttService.connect(this.url,port,this.username,this.password);
  	//this.mqttService.connectPaho(host,port,username,password);
  	console.log('connect to mqtt is called');
  }

  //unsubscribes Mqtt
  unSubscribeMqtt():void{
  	this.mqttService.unsubscribeMqtt();
  }
}
