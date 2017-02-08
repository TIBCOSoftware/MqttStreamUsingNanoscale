interface Serializable<T> {
    deserialize(input: Object): T;
}

class apns implements Serializable<apns> {
    alert?: string;
    badge?: Number;
    sound?: string;

    deserialize(input) {
        this.alert = input.alert;
        this.badge = input.badge;
        this.sound = input.sound;
        return this;
    }
}

export class iosServiceData implements Serializable<iosServiceData> {
	channel:string;
	platform?:string;
	name?:string;
	period?:Number;
	token?:string;
	environment?:string;
	message?:string;
    apns?: apns;
    
    deserialize(input) {
    	this.channel=input.channel;
    	if(input.platform){
    		this.platform = input.platform;	
    	}
        
        if(input.name){
        	this.name=input.name;	
        }
        if(input.period){
        	this.period=input.period;	
        }
        if(input.token){
        	this.token=input.token;	
        }
        if(input.environment){
        	this.environment=input.environment;
        }
        if(input.message){
        	this.message=input.message;
        }
        if(input.apns){
        	this.apns = new apns().deserialize(input.apns);	
        }
        

        return this;
    }
}