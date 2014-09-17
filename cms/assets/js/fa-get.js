if (typeof FA == 'undefined') { // Make sure FA namespace is initialized
    var FA = {};
}

FA.httpWebService = function() { // FA web service helper
    // Init
    this.options = {
        url:   'http://ws2-qa.feedingamerica.org/fawebservice.asmx',
        xmlns: 'http://feedingamerica.org/'
    };

    // Private properties
    var self = this;

    // Public methods
    this.init = function(options) {
        self.options = $.extend({}, self.options, options);
    };

    this.request = function(method, data, path, successCallback, errorCallback) {
        var url = self.options.url + '/' + method;
        $.ajax({
            async: true,
            url: url,
            type: 'GET',
            contentType: 'text/plain',
            data: data,
            dataType: 'xml',
            success: function (data) {
                if (path == null) {
                    successCallback(self.toXML(data));
                } else {
                    data = self.toJSON(data);
                    if (path != '/') { 
                        data = digestResponse(path, data);
                    }
                    successCallback(data);
                }
            },
            error: function (data) {
                if (typeof(errorCallback) == 'function') {
                    errorCallback(data);
                }
            }
        });
    };

    this.toXML = function(data){
        if ($.isXMLDoc(data)) {
            return data;
        }
        return $.parseXML(data);
    };
    
    this.toJSON = function(data){
        if ($.xml2json) {
            return $.xml2json(data);
        }
        warn("jQuery.soap: Missing JQuery Plugin 'xml2json'");
    };
    
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
FA.ws = new FA.httpWebService();