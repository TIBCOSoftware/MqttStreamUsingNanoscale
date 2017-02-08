var ovenstatusData = (function () {
    function ovenstatusData() {
    }
    /*serial:string;
    temp?:Number;
    model?:string;*/
    /*ovenstatusData.prototype.deserialize = function (input) {
        this.channel = input.channel;
        this.message = input.message;
        return this;
    };*/
    ovenstatusData.prototype.deserialize = function (input) {
        this.MQTT = input.channel;
        //this.message = input.message;
        return this;
    };
    return ovenstatusData;
}());
export { ovenstatusData };
//# sourceMappingURL=ovenstatusData.js.map