import { iosServiceData } from './iosServiceData';
/*@Component({
  
  providers:[iosServiceData]
})*/
var iosService = (function () {
    function iosService() {
        this.platform = "ios";
        this.period = 31536000;
    }
    iosService.prototype.subscribe = function (host) {
        var self = this;
        /*self.gateway = new Gateway({url:{hostname:host,protocol:"https:",href:host+"/subscribe",port:""}});*/
        self.gateway = new Gateway({ url: { hostname: host, port: "" } });
        var data = new iosServiceData().deserialize({ "platform": "apns", "channel": "ios_chnl", "period": 31536000, "name": "test_ios_name", "token": "test_ios_token" });
        self.gateway.url(host + "/subscribe")
            .contentType("application/json")
            .method('POST')
            .data(data)
            .execute();
    };
    iosService.prototype.unsubscribe = function (host) {
        var self = this;
        self.gateway = new Gateway({ url: { hostname: host, port: "" } });
        var data = new iosServiceData().deserialize({ "platform": "apns", "environment": "development", "channel": "ios_chnl", "token": "test_ios_token" });
        self.gateway.url(host + "/unsubscribe")
            .contentType("application/json")
            .method('POST')
            .data(data)
            .execute();
    };
    iosService.prototype.publish = function (host) {
        var self = this;
        self.gateway = new Gateway({ url: { hostname: host, port: "" } });
        /*var data:any = {"channel": "ios_chnl","environment": "development","payload": {"apns": {"aps": {"alert": "Hello!!!","sound": "default","badge": 1}},"mqtt": "Test"}}*/
        //var data = new iosServiceData().deserialize({"channel": "ios_chnl","message":"testing from javascript sdk","environment":"development","apns": {"alert": "Hello!!!","sound": "default","badge": 1},"mqtt": "Test"});
        var data = new iosServiceData().deserialize({ "channel": "ios_chnl", "message": "testing from javascript sdk" });
        self.gateway.url(host + "/send-push")
            .contentType("application/json")
            .method('POST')
            .data(data)
            .execute();
    };
    iosService.prototype.streamNumbers = function (host, min, max, serial, model) {
        var self = this;
        self.gateway = new Gateway({ url: { hostname: host, port: "" } });
        var num = Math.floor(Math.random() * (max - min + 1)) + min;
        var data = new iosServiceData().deserialize({ "channel": "temp_stream", "message": "{serial:" + serial + "temp:" + num + "model:" + model + "}" });
        self.gateway.url(host + "/send")
            .contentType("application/json")
            .method('POST')
            .data(data)
            .execute();
    };
    return iosService;
}());
export { iosService };
//# sourceMappingURL=ios-service.js.map