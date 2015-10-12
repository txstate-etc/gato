jsonp = (function(){
    var callback_functions = {};
    var queue = [];

    var startjobs = function() {
        while ( queue.length && $H(callback_functions).keys().length < 5 ) {
            var job = queue.shift();
            realrequest(job[0],job[1],job[2]);
        }
    };

    self.request = function(url,params,callback_function) {
        queue.push([url,params,callback_function]);
        startjobs();
    };

    var realrequest = function(url,params,callback_function) {
        var callback_id = "a" + randomString();
        callback_functions[callback_id] = callback_function;
        
        timeout = params['timeout'] || 5000;
        delete params[timeout];
        
        var myparams = $H(params);
        myparams.set("jsonp_callback_id", callback_id);

        var scripttag = new Element("script",{ id: "jsonp_" + callback_id, src: url + "?" + myparams.toQueryString() });
        $$("body")[0].insert(scripttag);
        
        setTimeout(function() {
        	// send timeout to caller if the callback function still exists (the remote call never returned, or returned an error)
        	if(callback_functions[callback_id]) {
        		self.callback(callback_id, {'timeout': 'true'});
        	}
        }, timeout);
    };

    self.callback = function(callback_id,data) {
        $("jsonp_" + callback_id).remove();
        var callback_function = callback_functions[callback_id];
        delete callback_functions[callback_id];
        startjobs();
        if (callback_function) {
        	callback_function($H(data));
        }
    };

    function randomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return(randomstring);
    }

    return(self);
})();