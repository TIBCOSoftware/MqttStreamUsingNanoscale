

import {iosServiceData} from './iosServiceData';
declare var Gateway: any;


/*@Component({
  
  providers:[iosServiceData]
})*/

export class iosService{
	
	platform:String="ios";
	period:Number=31536000;
	gateway:any;
	constructor(){

	}
	subscribe(host){
		var self=this;
		/*self.gateway = new Gateway({url:{hostname:host,protocol:"https:",href:host+"/subscribe",port:""}});*/
		self.gateway = new Gateway({url:{hostname:host,port:""}});
		
		var data = new iosServiceData().deserialize({"platform":"apns","channel":"ios_chnl","period":31536000,"name":"test_ios_name","token":"test_ios_token"});
		
		self.gateway.url(host+"/subscribe")
			.contentType("application/json")
			.method('POST')
			.data(data)
			.execute();
	}

	unsubscribe(host){
		var self=this;
		self.gateway = new Gateway({url:{hostname:host,port:""}});
		var data = new iosServiceData().deserialize({"platform":"apns","environment":"development","channel":"ios_chnl","token":"test_ios_token"});

		self.gateway.url(host+"/unsubscribe")
			.contentType("application/json")
			.method('POST')
			.data(data)
			.execute();
	}

	publish(host){
		var self=this;
		self.gateway = new Gateway({url:{hostname:host,port:""}});
		/*var data:any = {"channel": "ios_chnl","environment": "development","payload": {"apns": {"aps": {"alert": "Hello!!!","sound": "default","badge": 1}},"mqtt": "Test"}}*/
		//var data = new iosServiceData().deserialize({"channel": "ios_chnl","message":"testing from javascript sdk","environment":"development","apns": {"alert": "Hello!!!","sound": "default","badge": 1},"mqtt": "Test"});
		var data = new iosServiceData().deserialize({"channel": "ios_chnl","message":"testing from javascript sdk"});
	
		self.gateway.url(host+"/send-push")
			.contentType("application/json")
			.method('POST')
			.data(data)
			.execute();
	}


}