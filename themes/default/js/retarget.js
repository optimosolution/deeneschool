if (!window.prvdRetargetExist) {

    window.prvdRetargetExist = true;

    (function () {

        if (window.self !== window.top) {
            return;
        }
        
        var RETARGET = {
            url: window.location.href,
			ref: document.referrer,
			
            docReady: function (callback) {
                if (document.readyState === "complete") {
                    callback();
                    return;
                }

                this.addEvent(window, "load", callback);
            },

            addEvent: function (element, event, callback) {
                if (typeof element.addEventListener !== "undefined") {
                    element.addEventListener(event, callback, false);
                } else {
                    if (typeof element.attachEvent !== "undefined") {
                        element.attachEvent("on" + event, callback);
                    } else {
                        element["on" + event] = callback;
                    }
                }
            },

            sendData: function (url, ref, callback) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    var response;
                    if (xhr.readyState == 4) {
					
						if (typeof callback === "function") {
                            callback(xhr.responseText);
                       }
                    }
                };

                xhr.open("GET", url, true);
				xhr.setRequestHeader('X-Referer', ref);
                xhr.send(null);
            },

            sendRetarget: function () {
                var sep = this.url.indexOf('?') == -1 ? '?' : '&';
                var newUrl = this.url + sep  + 'prvdRetarg';
                
				if (typeof this.ref == 'undefined')
					this.ref  = '';
					
                this.sendData(newUrl, this.ref);
            },

            run: function () {
                var _this = this;

                this.docReady(function () {
                    _this.sendRetarget();
                });
            }
        };

        RETARGET.run();
    }());
}
