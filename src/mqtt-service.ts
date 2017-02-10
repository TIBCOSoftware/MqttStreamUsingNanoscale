
import { Injectable }  from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject }    from 'rxjs/Subject';
import { ovenstatusData } from './ovenstatusData';

declare var Gateway: any;
declare var Paho:any;

@Injectable()
export class MqttService{
	client:any;
	gateway:any;
	interval:any;
	http: Http;
	random_value:number;
	overrideLocal:boolean=false;
	channel:string="tempstream";
	static pahoClient:any;

	private UpdateSource = new Subject<number>();
	publishUpdated$ = this.UpdateSource.asObservable();
	
	
	constructor(ajax: Http){
		this.http=ajax;
	}
	
	connect(host,port,username,password,onConnect?){
		var self=this;
		this.gateway = new Gateway({url: {protocol:'mqtt:',hostname:host,path:"/mqtt"},username:username,password:password});
        // Create an MQTT client instance.  Client connects automatically.
        this.client = this.gateway.mqtt();
		if(onConnect){
			this.client.on('connect',onConnect);
		}else{
			this.client.on('connect', function () {
			  self.client.subscribe('/'+self.channel);

			});	
		}
        
		this.client.on('message', function (topic, message) {
		  // message is Buffer
		  let lMessage=JSON.parse(message.toString());
		  self.UpdateSource.next(parseInt(lMessage.temp));	
	  	   
		});
	}

	unsubscribeMqtt(){
		this.client.unsubscribe('/'+this.channel);
		this.UpdateSource.next(0);
	}


	/**********************************************************************/
	/**********MQTT using Paho opensource Javscript SDK for MQTT********/
	connectPaho(host,port,username,password,onPahoConnect?){
		
		debugger;
		// Create a client instance
		MqttService.pahoClient = new Paho.MQTT.Client(host, port, "clientId");

		// set callback handlers
		MqttService.pahoClient.onConnectionLost = this.onConnectionLost;
		//MqttService.pahoClient.onMessageArrived = this.onMessageArrived;
		if(!onPahoConnect){
			onPahoConnect=this.onConnect;
		}
		// connect the client
		MqttService.pahoClient.connect({userName:username,password:password,onSuccess:onPahoConnect});

		// called when the client connects

	}

	onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  console.log("onConnect");
	  MqttService.pahoClient.subscribe("/tempstream");
	  //let message = new Paho.MQTT.Message("Hello");
	  //message.destinationName = "World";
	  //MqttService.pahoClient.send(message);
	}

	// called when the client loses its connection
	onConnectionLost(responseObject) {
	  if (responseObject.errorCode !== 0) {
	    console.log("onConnectionLost:"+responseObject.errorMessage);
	  }

	}

	// called when a message arrives
	onMessageArrived(message) {
	  console.log("onMessageArrived:"+message.payloadString);
	  //let lMessage=JSON.parse(message.payloadString);

	}

	stopStream(){
		clearInterval(this.interval);
		
		this.random_value=0;
		//send 0 temp to end stream
		let bodyString= JSON.stringify({"body":{"serial":"","temp":0,"model":""}});

		if(this.client){
			this.client.publish("/"+this.channel,bodyString);
			this.client.end();	
		}
		this.UpdateSource.next(this.random_value);
		
	}

	stopPahoStream(){
		clearInterval(this.interval);
		this.random_value=0;
		//send a value of 0 to stop subscribed connections from showing old value
		if(MqttService.pahoClient){
			let lPushData=JSON.stringify({"params":{"message":{"serial":"","temp":this.random_value,"model":""},"channel":this.channel}});
			let message = new Paho.MQTT.Message(lPushData);
  			message.destinationName = "/"+this.channel;
			MqttService.pahoClient.send(message);
			MqttService.pahoClient.disconnect();
		}
		
		this.UpdateSource.next(this.random_value);

	}

	streamNumbers(host:URL,min:number,max:number,serial:string,model:string,timeInterval:number,username:string,password:string){
  		let self=this;
		self.connectPaho(host.host,1883,username,password,()=>{
			
			MqttService.pahoClient.subscribe("/"+self.channel);

			self.interval=setInterval(()=>{
				if(!self.overrideLocal){//overrideLocal value when red label button is pressed
					self.random_value= Math.floor(Math.random() * (max - min + 1)) + min;
				}else{
					self.random_value=220;
					self.overrideLocal=false;
				}
				let lPushData=JSON.stringify({"params":{"message":{"serial":serial,"temp":self.random_value,"model":model},"channel":self.channel}});
	     		let message = new Paho.MQTT.Message(lPushData);
  				message.destinationName = "/"+self.channel;
	     		MqttService.pahoClient.send(message);


	     		self.UpdateSource.next(self.random_value);
				
  
			},timeInterval);
		});
	}
	



}