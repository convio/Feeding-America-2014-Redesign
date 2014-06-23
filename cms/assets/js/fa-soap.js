if (typeof FA == 'undefined') { // Make sure FA namespace is initialized
    var FA = {};
}

FA.webService = function() { // FA web service helper
    // Properties
    this.options = {
        url:   'http://ws.feedingamerica.org/FAWebService.asmx',
        xmlns: 'http://feedingamerica.org/'
    };

    // Private properties
    var self = this;

    // Public methods
    this.init = function(options) {
        self.options = $.extend({}, self.options, options);
    };

    this.request = function(method, data, path, successCallback, errorCallback) {
        $.soap({
            url: self.options.url,
            method: method,
            appendMethodToURL: false,
            SOAPAction: self.options.xmlns + method,
            envAttributes: {
                'xmlns': self.options.xmlns
            },
            data: data,
            success: function (soapResponse) {
                successCallback(digestResponse(path, soapResponse.toJSON()));
            },
            error: function (soapResponse) {
                if (typeof(errorCallback) == 'function') {
                    errorCallback(soapResponse);
                }
            }
        });
    }

    // Private methods
    function digestResponse(path, data) {
        var path = path.split('/');
        for (var i = 0; i < path.length; i++) {
            if (data[path[i]]) {
                data = data[path[i]];
            } else {
                return null;
            }
        }
        if (data.constructor == Array) {
            return data;
        } else {
            return [data];
        }
    }
};
FA.soap = new FA.webService();