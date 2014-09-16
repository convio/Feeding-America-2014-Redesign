if (typeof FA == 'undefined') { // Make sure FA namespace is initialized
    var FA = {};
}

FA.webService = function() { // FA web service helper
    // Init
    $.support.cors = true;
    
    //temp update http://ws2.feedingamerica.org/FAWebService.asmx will be http://ws.feedingamerica.org/FAWebService.asmx at go live
    //url:   'http://ws.feedingamerica.org/FAWebService.asmx',
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
			async: true,
            url: self.options.url,
            method: method,
            appendMethodToURL: false,
            SOAPAction: self.options.xmlns + method,
            envAttributes: {
                'xmlns': self.options.xmlns
            },
            data: data,
            success: function (soapResponse) {
                if (path == null) {
                    successCallback(soapResponse.toXML());
                } else {
                    successCallback(digestResponse(path, soapResponse.toJSON()));
                }
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
            var key = path[i];
            if (!data[key] && key == 'Body') {
                key = 'soap:Body';
            }
            if (data[key]) {
                data = data[key];
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