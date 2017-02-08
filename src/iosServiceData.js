var apns = (function () {
    function apns() {
    }
    apns.prototype.deserialize = function (input) {
        this.alert = input.alert;
        this.badge = input.badge;
        this.sound = input.sound;
        return this;
    };
    return apns;
}());
var iosServiceData = (function () {
    function iosServiceData() {
    }
    iosServiceData.prototype.deserialize = function (input) {
        this.channel = input.channel;
        if (input.platform) {
            this.platform = input.platform;
        }
        if (input.name) {
            this.name = input.name;
        }
        if (input.period) {
            this.period = input.period;
        }
        if (input.token) {
            this.token = input.token;
        }
        if (input.environment) {
            this.environment = input.environment;
        }
        if (input.message) {
            this.message = input.message;
        }
        if (input.apns) {
            this.apns = new apns().deserialize(input.apns);
        }
        return this;
    };
    return iosServiceData;
}());
export { iosServiceData };
//# sourceMappingURL=iosServiceData.js.map