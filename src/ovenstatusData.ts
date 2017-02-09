interface Serializable<T> {
    deserialize(input: Object): T;
}

export class ovenstatusData implements Serializable<ovenstatusData> {
    channel:string;
    message:string;
	/*serial:string;
	temp?:Number;
	model?:string;*/

    
    deserialize(input) {
    	//this.channel=input.channel;
    	this.message= input.message;
        return this;
    }
}