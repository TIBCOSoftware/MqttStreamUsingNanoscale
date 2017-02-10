import { Component,Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MqttService } from '../../mqtt-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @Input() url:string="https://openwisk-mqtt.staging.nanoscaleapi.io";
  @Input() serial:string="";
  @Input() model:string="";
  @Input() warmth:any={lower:100,upper:160};
  @Input() timeinterval:number=1;
  @Input() username:string="qa@nanoscale.io,OpenWisk Temp MQTT Example,push,MQTT";
  @Input() password:string="password";
  disableStream:boolean=false;

  constructor(public navCtrl: NavController,private mqttService:MqttService) {

  }
  //this will work when web socket support gets enabled
  /*connectToMqtt():void{
  	let host:string="perfect-whip-5690.staging.nanoscaleapi.io";
    let port:number =1883;
    let username:string="shassan@anypresence.com,MQTTStreaming,push,MQTT";
  	let password:string="password";
  	this.mqttService.connect(host,port,username,password);
  	console.log('connect to mqtt is called');
  }

  pahoConnectToMqtt():void{
    let host="perfect-whip-5690.staging.nanoscaleapi.io";
    let port:number =1883;
    let username:string="shassan@anypresence.com,MQTTStreaming,push,MQTT";
    let password:string="password";
    this.mqttService.connectPaho(host,port,username,password);
  }

  

  subscribeIOS():void{
    var host:String="https://ceaseless-trains-4183.staging.nanoscaleapi.io/push/pushRemoteEndpoint";
  
    this.iosService.subscribe(host);
    console.log('connect to mqtt is called');
  }

  unsubscribeIOS():void{
    var host:String="https://ceaseless-trains-4183.staging.nanoscaleapi.io/push/pushRemoteEndpoint";
  
    this.iosService.unsubscribe(host);
    console.log('connect to mqtt is called');
  }

  publishIOS():void{
    var host:String="https://ceaseless-trains-4183.staging.nanoscaleapi.io";
  
    this.iosService.publish(host);
    console.log('connect to mqtt is called');
  }
  */
  restrictNumeric(e){//dont allow anything other then numbers in time interval field

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
  }

  streamTemperature(){
    
    let host= new URL(this.url);
    this.mqttService.streamNumbers(host,this.warmth.lower,this.warmth.upper,this.serial,this.model,this.timeinterval*1000,this.username,this.password);
    this.disableStream=true;//disable the button
  }

  stopStreaming(){
    this.disableStream=false;//enable the button
    this.mqttService.stopPahoStream();
  }

  RedLineCrossed(){
    this.mqttService.overrideLocal=true;
    
  }
}
