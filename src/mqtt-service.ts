
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
	channel:string="temp_stream";
	static pahoClient:any;

	private UpdateSource = new Subject<number>();
	publishUpdated$ = this.UpdateSource.asObservable();
	
	private headers = new Headers({'Content-Type': 'application/json'});


	constructor(ajax: Http){
		this.http=ajax;
	}
	
	connect(host,port,username,password){
		var self=this;
		
		//this.gateway = new Gateway({url: {protocol:'mqtt:',hostname:host,port:port},username:username,password:password});
		this.gateway = new Gateway({url: {protocol:'mqtt:',hostname:host,path:"/mqtt"},username:username,password:password});
        // Create an MQTT client instance.  Client connects automatically.
        this.client = this.gateway.mqtt();
		
        // Interact with the MQTT client as described in the MQTT documentation.
		this.client.on('connect', function () {
			debugger;
			console.log("subscribe to a channel");
		  self.client.subscribe('/'+self.channel);

		  //self.client.publish('temp_stream', 'Hello mqtt');
		});
		this.client.on('message', function (topic, message,msg) {
		  // message is Buffer
		  console.log(message.toString());
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
	connectPaho(host,port,username,password){
		
		debugger;
		// Create a client instance
		MqttService.pahoClient = new Paho.MQTT.Client(host, port, "clientId");

		// set callback handlers
		MqttService.pahoClient.onConnectionLost = this.onConnectionLost;
		MqttService.pahoClient.onMessageArrived = this.onMessageArrived;

		// connect the client
		MqttService.pahoClient.connect({userName:username,password:password,onSuccess:this.onConnect});


		// called when the client connects

	}

	onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
		console.log("onConnect");
	  MqttService.pahoClient.subscribe("/temp_stream");
	  //let message = new Paho.MQTT.Message("Hello");
	  //message.destinationName = "World";
	  //MqttService.pahoClient.send(message);
	}

	// called when the client loses its connection
	onConnectionLost(responseObject) {
		debugger;
	  if (responseObject.errorCode !== 0) {
	    console.log("onConnectionLost:"+responseObject.errorMessage);
	  }
	}

	// called when a message arrives
	onMessageArrived(message) {
		debugger;
	  console.log("onMessageArrived:"+message.payloadString);
	  //let lMessage=JSON.parse(message.payloadString);

	}

	/***************end of Paho javascript SDK Code*************************/
	/**********************************************************************/

	/*connectAndStream(host:string,username:string,password:string,min:number,max:number,serial:string,model:string,timeInterval:number){
		var self=this;
		debugger;
		//this.gateway = new Gateway({url: {protocol:'mqtt:',hostname:host,port:port},username:username,password:password});
		this.gateway = new Gateway({url: {protocol:'mqtt:',hostname:host,path:"/mqtt"},username:username,password:password});
        // Create an MQTT client instance.  Client connects automatically.
        this.client = this.gateway.mqtt();
		this.gateway.cache(false);
        // Interact with the MQTT client as described in the MQTT documentation.
		this.client.on('connect', function () {
			debugger;
			console.log("subscribe to a channel");
			  self.client.subscribe('temp_stream');
			  self.interval=setInterval(()=>{
				debugger;
				let num= Math.floor(Math.random() * (max - min + 1)) + min;
				let data = new ovenstatusData().deserialize({"channel": "temp_stream","message":"{\"serial\":\""+serial+"\",\"temp\":\""+num+"\",\"model\":\""+model+"\"}"});
			
				self.client.publish('temp_stream', JSON.stringify({"serial":"\""+serial+"\"","temp":"\""+num+"\"","model":"\""+model+"\""}));
			  },timeInterval);
			  
		});
		this.client.on('message', function (topic, message) {
		  // message is Buffer
		  console.log(message.toString());
		  clearInterval(self.interval);
		  self.client.end();
		});
	}*/

	stopStream(host:URL){
		clearInterval(this.interval);

		//send 0 temp to end stream
		let bodyString= JSON.stringify({"channel": this.channel,"message":"{\"serial\":\"\",\"temp\":\"0\",\"model\":\"\"}"});
    	let options = new RequestOptions({ headers: this.headers }); // Create a request option

    	let PostRequest=this.http.post(host.href+"send_push", bodyString, options) // ...using post request
             .map((res:Response) => 
             	{
             		
             		//console.log(res.json());
             	}) // ...and calling .json() on the response to return data
             .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if a
 
        PostRequest.subscribe(
            response => {
                // Emit list event
                console.log(response);
            }, 
            err => {
                // Log errors if any
                console.log(err);
            });

		if(this.client){
			this.client.end();	
		}
		this.random_value=0;
		this.UpdateSource.next(this.random_value);
		
	}

	streamNumbers(host:URL,min:number,max:number,serial:string,model:string,timeInterval:number){
  		let self=this;
		
		this.interval=setInterval(()=>{
			if(!self.overrideLocal){//overrideLocal value when red label button is pressed
				self.random_value= Math.floor(Math.random() * (max - min + 1)) + min;
			}else{
				self.random_value=220;
				self.overrideLocal=false;
			}
			//this.UpdateSource.next(self.random_value);
			let data = new ovenstatusData().deserialize({"channel": self.channel,"message":"{\"serial\":\""+serial+"\",\"temp\":\""+self.random_value+"\",\"model\":\""+model+"\"}"});
		
			//let bodyString = JSON.stringify({"channel": "temp_stream","message":"{\"serial\":\""+serial+"\",\"temp\":\""+num+"\",\"model\":\""+model+"\"}"}); // Stringify payload
			let bodyString= JSON.stringify(data);
        	let options = new RequestOptions({ headers: self.headers }); // Create a request option

        	let PostRequest=this.http.post(host.href+"send_push", bodyString, options) // ...using post request
                 .map((res:Response) => 
                 	{
                 		
                 		//console.log(res.json());
                 	}) // ...and calling .json() on the response to return data
                 .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if a
     
            PostRequest.subscribe(
                response => {
                    // Emit list event
                    console.log(response);
                    self.UpdateSource.next(self.random_value);
                }, 
                err => {
                    // Log errors if any
                    console.log(err);
                });
  
		},timeInterval);

	}
	/*streamNumbers(host:URL,min:number,max:number,serial:string,model:string,timeInterval:number){
  		let self=this;
		
		this.interval=setInterval(()=>{
			if(!self.overrideLocal){//overrideLocal value when red label button is pressed
				self.random_value= Math.floor(Math.random() * (max - min + 1)) + min;
			}else{
				self.random_value=220;
				self.overrideLocal=false;
			}
			this.UpdateSource.next(self.random_value);
			//let data = new ovenstatusData().deserialize({"channel": self.channel,"message":"{\"serial\":\""+serial+"\",\"temp\":\""+self.random_value+"\",\"model\":\""+model+"\"}"});
			//this.UpdateSource.next(self.random_value);
			//let data = new ovenstatusData().deserialize({"MQTT":"{\"serial\":\""+serial+"\",\"temp\":\""+self.random_value+"\",\"model\":\""+model+"\"}"});
		
			//let bodyString = JSON.stringify({"channel": "temp_stream","message":"{\"serial\":\""+serial+"\",\"temp\":\""+num+"\",\"model\":\""+model+"\"}"}); // Stringify payload
			let bodyString= JSON.stringify({"MQTT":{"serial":serial,"temp":self.random_value,"model":model}});
        	let options = new RequestOptions({ headers: self.headers }); // Create a request option

        	let PostRequest=this.http.post(host.href+"send_push", bodyString, options) // ...using post request
                 .map((res:Response) => 
                 	{
                 		
                 		//console.log(res.json());
                 	}) // ...and calling .json() on the response to return data
                 .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if a
     
            PostRequest.subscribe(
                response => {
                    // Emit list event
                    console.log(response);
                    self.UpdateSource.next(self.random_value);
                }, 
                err => {
                    // Log errors if any
                    console.log(err);
                });
  
		},timeInterval);

	}*/



}