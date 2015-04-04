(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	//start!
	var Injectable = require('./core/injectable');

	var inj = new Injectable([
		require('./panel'),
		require('./icon'),
		require('./services/http'),
		require('./services/dom')
	]);

	inj.start('Icon');
},{"./core/injectable":2,"./icon":4,"./panel":5,"./services/dom":6,"./services/http":7}],2:[function(require,module,exports){
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var FN_NAME = /^function[\s\n](.*?)[\s\n]*\(/;

function Injectable (injectables) {
	this.modules = {};
	this.services = {};

	var _    = require('underscore'),
		self = this,
        fnText,
		fnName,
		module,
        i;

	this.tplCache = require('./tplcache');
	this._ = _;

	_.templateSettings = {
	    evaluate:    /\{\{(.+?)\}\}/g,
	    interpolate: /\{\{=(.+?)\}\}/g,
	    escape:      /\{\{-(.+?)\}\}/g
	};

	for (i = 0; i < injectables.length; i++) {
		module = injectables[i].module;
		fnText = module.toString().replace(STRIP_COMMENTS, '');
		fnName = this.getFnName(fnText);

		if (this.isService(fnName)) {
			this.services[fnName] = (function() {
				var processedArgs = self.processArgs(fnText);
				return module.apply(module, processedArgs);
			})();
		} else {
			this.modules[fnName] = (function(fnText, module, deps) {
				return function() {
					//we need to trigger this only after function call
					var processedArgs = self.processArgs(fnText, deps);

					return module.apply(module, processedArgs);
				};

			})(fnText, module,  injectables[i].deps || null);

		}
	}
}

Injectable.prototype.isTemplate = function (moduleName) {
	return moduleName.slice(-3) === 'Tpl';
};

Injectable.prototype.start = function (moduleName) {
	this.modules[moduleName]();
};

Injectable.prototype.isService = function (fnName) {
	return fnName.charAt(0) === '$';
};

Injectable.prototype.getFnName = function (fnText) {
	var fnName = fnText.match(FN_NAME);

	return fnName[1];
};

Injectable.prototype.getScopeFn = function (deps) {
	var self = this;

	var tmpScope = {
		run: function (fnName, argArray) {
			var fnText = this[fnName].toString().replace(STRIP_COMMENTS, '');
			var processedArgs = self.processArgs(fnText);
			var finalArgs = processedArgs.concat(argArray);

			this[fnName].apply(this, finalArgs);
		}
	};

	//adding dependencies to a scope
	if (deps) {
		tmpScope = this._.extend(tmpScope, deps);
	}

	return tmpScope;
};

Injectable.prototype.processArgs = function (fnText, deps) {
	var argDecl, 
		argArray, 
		arg,
		modArgs = [],
		self = this,
        j;

		argDecl = fnText.match(FN_ARGS);
		argArray = argDecl[1].split(FN_ARG_SPLIT);
		//iteration over all args of module
		for (j = 0; j < argArray.length; j++) {
			arg = argArray[j];
			arg.replace(FN_ARG, function(all, underscore, name) {
            	/**
            	*	it's a technical item
            	*	List of items supported:
            	*	_scope_
            	**/

            	if (underscore === '_') {
            		switch(name) {
            			case 'scope':
            				modArgs.push(self.getScopeFn(deps));
            				break;

            			default:
            				break;
            		}
            	}
            	//it's a service
            	else if (self.isService(name)) {
					modArgs.push(self.getService(name));
            	} 
            	else if (self.isTemplate(name)) {
            		modArgs.push(self.getTemplate(name));
            	}
            	else if (name === '_') {
            		modArgs.push(self._);
            	}

            	//it's an usual injectable module
            	else {
            		modArgs.push(self.getModule(name));          		
            	}

          	});
		}

		return modArgs;
};

Injectable.prototype.getModule = function (name) {
	var module = null;

	if (this.modules && this.modules.hasOwnProperty(name)) {
		module = this.modules[name];
	}

	return module;
};

Injectable.prototype.getTemplate = function (name) {
	var realName = name.slice(0,-3),
	    template = null;

	if (this.tplCache && this.tplCache.hasOwnProperty(realName)) {
		template = this.tplCache[realName];
	}

	return template;
};

Injectable.prototype.getService = function (name) {
	var service = null;

	if (this.services && this.services.hasOwnProperty(name)) {
		service = this.services[name];
	}

	return service;
};

module.exports = Injectable;
},{"./tplcache":3,"underscore":8}],3:[function(require,module,exports){
module.exports = {"icon":"\r\n\t<style unselectable=\"on\">\r\n\t\t.privdog-netapp {\r\n            width: 19px;\r\n            height: 19px;\r\n            position: fixed;\r\n            bottom: 20px;\r\n            right: 20px;\r\n\t\t\toverflow: visible;\r\n            z-index: 9999999;\r\n            cursor: pointer;\r\n\r\n            -moz-user-select: none; \r\n\t\t\t-khtml-user-select: none; \r\n\t\t\t-webkit-user-select: none; \r\n\t\t\t-o-user-select: none; \r\n\t\t\tuser-select: none;\r\n\t\t}\r\n\r\n\t\t.privdog-netapp-icon {\r\n\t\t\twidth: 100%; \r\n\t\t\theight: 100%;\r\n\t\t}\r\n\r\n\t\t.privdog-netapp-icon-container {\r\n\t\t\topacity: 0.3;\r\n\t\t\tposition: absolute;\r\n\t\t\ttop: 0px;\r\n\t\t\twidth: 19px;\r\n\t\t\toverflow: visible;\r\n\t\t}\r\n\r\n\t\t.privdog-netapp-icon-container:hover {\r\n\t\t\topacity: 1;\r\n\t\t\tposition: absolute;\r\n\t\t\ttop: 0px;\r\n\t\t}\r\n\r\n\t\t.privdog-netapp-icon-container:hover .privdog-netapp-total {\r\n\t\t}\r\n\r\n\t\t.privdog-netapp-total {\r\n\t\t\tposition: absolute;\r\n\t\t\tbottom: -5px;\r\n\t\t\tright: -5px;\r\n\t\t\ttext-align: center;\r\n\t\t\tfont-family: tahoma, sans-serif;\r\n\t\t\tfont-weight: 900;\r\n\t\t\tfont-size: 10pt;\r\n\t\t\tcolor: red;\r\n\t\t}\r\n\t</style>\r\n\t<!--[if lt IE 9]>\r\n\t\t<style>\r\n\t\t\t.privdog-netapp-icon-container { filter: alpha(opacity=30);}\r\n\t\t\t.privdog-netapp-icon-container:hover { filter: alpha(opacity=100);}\r\n\t\t\t.privdog-netapp-icon-container:hover .privdog-netapp-total { filter: alpha(opacity=100);}\r\n\t\t\t.privdog-netapp-total { filter: alpha(opacity=30);}\r\n\t\t</style>\r\n\t<![endif]-->\r\n\t<div unselectable=\"on\" class=\"privdog-netapp-icon-container\">\r\n\t\t<img unselectable=\"on\" class=\"privdog-netapp-icon\" src=\"{{=src}}\"/> \r\n\r\n\t\t<div unselectable=\"on\" id=\"privdog_netapp_total_info\" class=\"privdog-netapp-total\" title=\"{{=total}} Threats blocked since your browser started\">\r\n\t\t\t{{=total_short}}\r\n\t\t</div>\r\n\t</div>\r\n","panel":"\r\n    <style>\r\n        html, body {\r\n            font-family: Arial, Tahoma, serif;\r\n            padding:0;\r\n            margin:0;\r\n            background: rgb(247, 247, 247);\r\n            overflow-y:auto;\r\n            overflow-x:hidden;\r\n            width:360px;\r\n\r\n            -moz-user-select: none; \r\n            -khtml-user-select: none; \r\n            -webkit-user-select: none; \r\n            -o-user-select: none; \r\n            user-select: none;\r\n        }\r\n\r\n        a{font-size:12px;color:white;text-decoration:none;}\r\n        a:hover{text-decoration:underline;}\r\n\r\n        #headBand {\r\n            display: block;\r\n            overflow: auto;\r\n            padding: 10px 8px 15px 10px;\r\n        }\r\n\r\n        #pluginLogo {\r\n            float: left;\r\n            margin: 0;\r\n        }\r\n        \r\n        #optionsButton {\r\n            float: right;\r\n            margin: 15px 7px 0 0;\r\n        }\r\n\r\n        #whiteListFound{padding: 22px 6px 22px 18px;/*border-top:1px solid #292727*/;color:#424242;font-size:12px;font-weight:bold;/*text-shadow: 0 1px 1px #171717;*/\r\n            /*background: url('/images/whitelist-bg.png') repeat-x left center;*/}\r\n            #whiteListFound a{float:right;color:#0194a5;font-size:12px;font-weight:bold;text-decoration: none;padding: 6px 25px;margin: -6px 16px 0 0;\r\n                border-radius: 3px;\r\n                /*text-shadow: 0 1px 1px #1b9198;*/\r\n                box-shadow:0px 1px 2px #6c6b68;\r\n                background: #ffffff; /* Old browsers */\r\n                background: -moz-linear-gradient(top,  #ffffff 0%, #cfcfcf 100%); /* FF3.6+ */\r\n                /* background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#27bfc8), color-stop(100%,#16868c)); Chrome,Safari4+ */\r\n                background: -webkit-linear-gradient(top,  #ffffff 0%,#cfcfcf 100%); /* Chrome10+,Safari5.1+ */\r\n                background: linear-gradient(to bottom,  #ffffff 0%,#cfcfcf 100%); /* W3C */\r\n\r\n            }\r\n            #whiteListFound a:hover{text-decoration: none;background: #ffffff;}\r\n\r\n        #msgThreatsFound{padding: 10px 0 10px 18px;margin:0 0 10px 0;color:white;font-size:12px;font-weight:bold;/*text-shadow: 0 0 2px #bf2e15;*/}\r\n            .no-threatsFound{background: #68aa00;}\r\n            .threatsFound{\r\n                #background: #fc5300;\r\n                #background: #5597C3;\r\n                background: rgb(73, 162, 220);\r\n            }\r\n            .notScanned{background: #039BCF;}\r\n\r\n        #threats { \r\n            display: block;\r\n            height: 160px; \r\n            overflow: auto; \r\n        }\r\n\r\n        #threats ul{list-style: none;padding:0;margin:0;}\r\n\r\n        #threats ul li {\r\n            display: block;\r\n            padding: 0px 18px;\r\n            margin: 0;\r\n            font-size: 12px;\r\n            color: #424242;\r\n            font-weight: bold;\r\n            white-space: nowrap;\r\n            text-overflow: ellipsis;\r\n            border-top: 1px solid #f4f4f4;\r\n            border-bottom: 1px solid #c9c9c9;\r\n        }\r\n\r\n        #threats ul li.expandable{cursor:pointer;}\r\n        #threats ul li:first-child{border-top:none;}\r\n        #threats ul li.lastCat{border-bottom:none;}\r\n\r\n\r\n        #threats ul li b{float:left;}\r\n        #threats ul li i{float:right;font-style: normal;font-weight: bold;}\r\n        #threats ul li i span{color:#639b03;}\r\n        #threats ul li i span.red{\r\n            #color:#fc5300;\r\n            #color:#5597C3;\r\n            color: rgb(73, 162, 220);\r\n        }\r\n        #threats ul li a{color:#03afce;}\r\n\r\n\r\n        #sessionCounter {\r\n            display: block;\r\n            position: fixed;\r\n            bottom: 0px;\r\n            left: 0px;\r\n            right: 0px;\r\n            color: #FFFFFF;\r\n            font-size: 12px;\r\n            font-weight: bold;\r\n            padding: 10px 0 10px 5px;\r\n            text-align: center;\r\n            background: rgb(73, 162, 220);\r\n        }\r\n        \r\n        #sessionCounter b{display:inline-block;font-size: 28px;font-weight: normal;vertical-align: middle;padding: 0 3px 0 0;}\r\n\r\n\r\n        /*element need to be hided on popup init*/\r\n        #whiteListFound{display: none;}\r\n        #threats{display: none;}\r\n\r\n\r\n        /*hiding requested in ticket*/\r\n        #onoff, #addToWhitelist, #removeFromWhitelist{\r\n            display: none;\r\n        }\r\n\r\n        .clear{\r\n            clear:both;\r\n        }\r\n\r\n        .drop-list{\r\n            background: #fff;\r\n            font-size: 12px;\r\n            margin:0;\r\n            padding:0;\r\n            display:none;\r\n        }\r\n\r\n        .drop-list p{\r\n            margin:0;\r\n            padding:0;\r\n            padding-left:25px;\r\n            color:#737373;\r\n            line-height: 18px;\r\n        }\r\n        .drop-list p span{\r\n            float: right;\r\n            padding-right: 18px;\r\n        }\r\n\r\n        .arrow{\r\n            background:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAPCAYAAADZCo4zAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUE0NjAyMUIwNENGMTFFMzlENDY5NzFERUY4Q0VBODQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUE0NjAyMUMwNENGMTFFMzlENDY5NzFERUY4Q0VBODQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQTQ2MDIxOTA0Q0YxMUUzOUQ0Njk3MURFRjhDRUE4NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQTQ2MDIxQTA0Q0YxMUUzOUQ0Njk3MURFRjhDRUE4NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pmt/vv4AAACxSURBVHjaYpy6YOE2BgYGTwbsYDsTkCgC4j9YJEFiRUxZ8XE3gIxpWBRMA8kxQTlNQPwWSfItVIwBrACoEi4A0wAVY2BCNhKIb0Ax3ErG////I1QsXOQBEgPq3o5VATaAzQSQm3ZgKABKsgCpS1BxPaCiP+iOzARiTSjORDEBqFsYyL4JxMJI4aAGNOUdzIQ6JEkGKLsebAIwsjSA9GUgZsESF7ogE/qwSDJAxfoAAgwAk0Q/6tE04fgAAAAASUVORK5CYII=\") no-repeat left top;\r\n            display:block;\r\n            width:8px;\r\n            height:8px;\r\n            float:left;\r\n            margin-right:10px;\r\n            margin-top:13px;\r\n        }\r\n\r\n        .arrow-invis{\r\n            display:block;\r\n            width:8px;\r\n            height:8px;\r\n            float:left;\r\n            margin-right: 10px;\r\n            margin-top: 13px;\r\n        }\r\n\r\n        .opened{\r\n            background-position: left -8px;\r\n        }\r\n\r\n        .initializing {\r\n            width: 400px;\r\n            height: 200px;\r\n        }\r\n\r\n        .initializing .initializing-mes {\r\n            display: block;\r\n            position: fixed;\r\n            height: 100px;\r\n            width: 100%;\r\n            line-height: 100px;\r\n            top: 50%;\r\n            margin-top: -50px;\r\n            text-align: center;\r\n            color: #424242;\r\n            font-size: 16pt;\r\n            font-weight: 900;\r\n        }\r\n\r\n        .initializing .main {\r\n            display: none;\r\n        }\r\n\r\n        .initializing-mes {\r\n            display: none;\r\n        }\r\n\r\n        #optionsButton {\r\n            cursor: pointer;\r\n        }\r\n\r\n        .test-animation {\r\n            -webkit-transition: all 0.8s ease-in-out;\r\n            -moz-transition: all 0.8s ease-in-out;\r\n            -o-transition: all 0.8s ease-in-out;\r\n            -ms-transition: all 0.8s ease-in-out;\r\n            transition: all 0.8s ease-in-out;\r\n        }\r\n\r\n        .test-animation-start {\r\n            -webkit-transform: rotate(360deg);\r\n            -moz-transform: rotate(360deg);\r\n            -o-transform: rotate(360deg);\r\n            -ms-transform: rotate(360deg);\r\n            transform: rotate(360deg);\r\n        }\r\n\r\n        .list-open .arrow {\r\n            background-position: left -8px;\r\n            display: block;\r\n            width: 8px;\r\n            height: 8px;\r\n            float: left;\r\n            margin-right: 10px;\r\n            margin-top: 13px;\r\n        }\r\n\r\n        .empty-list .arrow {\r\n            background: none !important;\r\n        }\r\n\r\n        .rd-style {\r\n            position: relative;\r\n            font-size: 7pt;\r\n            top: -8px;\r\n            left: -2px;\r\n        }\r\n    </style>\r\n    <!--[if (IE 9) | (IE 10)]>\r\n        <style>\r\n            #threats ul li i span{color:#639b03; vertical-align: sub;}\r\n        </style>\r\n    <![endif]-->\r\n    \r\n    <style>\r\n        * { \r\n            zoom:1;\r\n        }\r\n\r\n        /* Hack for ie10 and more */\r\n        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) { #threats ul li b { line-height: 36px !important;}}\r\n\r\n        #threats { height: 161px !important;}\r\n        #threats ul li { \r\n            font-weight: 500 !important;\r\n            height: 37px !important;\r\n            line-height: 37px !important;\r\n            overflow: hidden !important;\r\n        }\r\n        .arrow { overflow: hidden;}\r\n    </style>\r\n\r\n    <div unselectable=\"on\" class=\"main\">\r\n        <div unselectable=\"on\">\r\n            <div unselectable=\"on\" id=\"headBand\">\r\n                <img unselectable=\"on\" id=\"pluginLogo\" width=\"170\" src=\"{{=logo}}\" alt=\"ThreatFinder\"/>\r\n                <a unselectable=\"on\" id=\"optionsButton\" title=\"Options panel\">\r\n                    <img unselectable=\"on\" src=\"{{=options}}\" alt=\"Options\"/>\r\n                </a>\r\n            </div>\r\n            <div unselectable=\"on\" id=\"msgThreatsFound\" class=\"threatsFound\">\r\n                <span unselectable=\"on\" id=\"threats_found\"></span> Threats blocked since your browser started\r\n            </div>\r\n        </div>\r\n        <div unselectable=\"on\" id=\"threats\" style=\"display: block;\">\r\n            <ul unselectable=\"on\">\r\n                <li unselectable=\"on\" class=\"expandable list-close\" id=\"li_ad_view\" data-view=\"ad_view\">\r\n                    <span unselectable=\"on\" class=\"arrow\"></span>\r\n                    <b unselectable=\"on\">Ad Networks:</b> \r\n                    <i unselectable=\"on\"> <b id=\"ad_network_total\"></b> &nbsp;<span>sanitized</span></i>\r\n                </li>\r\n                <div unselectable=\"on\" id=\"ad_view\" class=\"drop-list\"></div>\r\n\r\n                <li unselectable=\"on\" class=\"expandable list-close\" id=\"li_tr_view\" data-view=\"tr_view\">\r\n                    <span unselectable=\"on\" class=\"arrow\"></span>\r\n                    <b unselectable=\"on\">Trackers:</b> \r\n                    <i unselectable=\"on\"> <b id=\"trackers_total\"></b> &nbsp;<span>blocked</span></i>\r\n                </li>\r\n                <div unselectable=\"on\" id=\"tr_view\" class=\"drop-list\"></div>\r\n\r\n                <li unselectable=\"on\" class=\"expandable list-close\" id=\"li_wi_view\" data-view=\"wi_view\">\r\n                    <span unselectable=\"on\" class=\"arrow\"></span>\r\n                    <b unselectable=\"on\">3\r\n                        <span class=\"rd-style\">rd </span> \r\n                        &nbsp;Party Widgets:\r\n                    </b> \r\n                    <i unselectable=\"on\"> <b id=\"party_widgets_total\"></b> &nbsp;<span>blocked</span></i>\r\n                </li>\r\n                <div unselectable=\"on\" id=\"wi_view\" class=\"drop-list\"></div>\r\n\r\n                <li unselectable=\"on\" class=\"expandable list-close lastCat\" id=\"li_st_view\" data-view=\"st_view\">\r\n                    <span unselectable=\"on\" class=\"arrow\"></span>\r\n                    <b unselectable=\"on\">Statistics:</b> \r\n                    <i unselectable=\"on\"> <b id=\"statistic_total\"></b> &nbsp;<span>blocked</span></i>\r\n                </li>\r\n                <div unselectable=\"on\" id=\"st_view\" class=\"drop-list\"></div>\r\n            </ul>\r\n        </div>\r\n        <div unselectable=\"on\" id=\"sessionCounter\" style=\"display: block;\">\r\n            <b unselectable=\"on\" id=\"session_counter_total\"></b>Threats blocked since PrivDog was installed\r\n        </div>\r\n    </div>\r\n"};
},{}],4:[function(require,module,exports){
function Icon (Panel, _scope_, $http, $dom, iconTpl, _) {
    var $ = $dom;

    _scope_.mode   = 2;      //2 - netapp, 0 - empty page/extension
    _scope_.width  = 50;
    _scope_.height = 50;
    _scope_.inject = false;
    _scope_.panel  = null;

    _scope_.version = "1.0.18";

    _scope_.fixDomains = function () {
        var keys = ["1", "2", "3", "4"],
            total,
            total_domains,
            domains,
            other,
            i,
            j;

        for (i = 0; i < keys.length; ++i) {
            total = _scope_.response[keys[i]].wasBlocked + _scope_.response[keys[i]].wasAllow;
            
            total_domains = 0;
            domains = _scope_.response[keys[i]].domains;

            for (j = 0; j < domains.length; ++j) {
                if (domains[j].name === "other") {
                    domains.splice(j, 1);
                    --j;
                }

                total_domains += domains[j].total;
            }

            other = total - total_domains;

            if (other > 0) {
                domains.push({domain: "other", total: other});
            }
        }
    };

    _scope_.fixResponse = function () {
        var response;

        response = {
            "1": {
                wasBlocked: 0,
                wasAllow: 0,
                domains: []
            },
            "2": {
                wasBlocked: 0,
                wasAllow: 0,
                domains: []
            },
            "3": {
                wasBlocked: 0,
                wasAllow: 0,
                domains: []
            },
            "4": {
                wasBlocked: 0,
                wasAllow: 0,
                domains: []
            },
            to: 0,
            ti: 50
        };

        _scope_.response = _.extend(response, _scope_.response);

        if (_scope_.response.ti === 0) {
            _scope_.response.ti = 5;
        }

        _scope_.fixDomains();
    }; 

    _scope_.getIconCounter = function () {
        var data = {
            total: _scope_.response.bs || 0,
            total_short: ""
        };

            if (parseInt(data.total, 10) > 999) {
                data.total_short = "999+";
            } else {
                data.total_short = data.total.toString();
            }

        return data;
    };

    _scope_.viewIconInfo = function () {
        var icon_counter = _scope_.getIconCounter(),
            total_view;

        $('#privdog_netapp_total_info')
            .html(icon_counter.total_short)
            .attr("title", icon_counter.total + " Threats blocked since your browser started");
    };

    _scope_.render = function() {
        var panel,
        	icon_config,
        	compiledTpl,
            icon_counter = _scope_.getIconCounter(),
        	$dv = $('<div/>');

        _scope_.changeData();
        _scope_.panel = Panel();

        icon_config = {
            src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0ZFRUZBREVBREZCMTFFMjgxMzBCRThCODY0MUZGMDEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0ZFRUZBREZBREZCMTFFMjgxMzBCRThCODY0MUZGMDEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3RkVFRkFEQ0FERkIxMUUyODEzMEJFOEI4NjQxRkYwMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3RkVFRkFEREFERkIxMUUyODEzMEJFOEI4NjQxRkYwMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtGLE/EAAASUSURBVHjarFRbb1RVFP7OPufMzDlzLTNtZ9rOYMq1XCwItQlBWi4q8fJA1KDyAELVYDDGoA++oEFRVIyYKFEICYkoIBCDJAIm3BprgYC0IaUDrZ0p0M502rnfzv24p8A/YO3sh52s/a1vfevC7O9MwMoykIjJHI3kNsVL6qrVIeeJVp9wSNINGCYgcgQL6x0gAHhCEJ4o81/0JHaMF9Xg2mmerUv89lHDNEEsHANCGPbQYGZvUtH2tU91rD0/WvgxqRoBhiUwCAOHjYOhA6pmwqSfjkeyn1wYKXyYUY1XjwxljuimaeMYirNqpgvhsrKBs5COi6/PwO5VDdiyqMZ1Jy3PFg3ATq9J6Q1kJQwXZPSOl6pO38ltPP1yI/o7mjC/Vlh6bCi7Jei2gKRlnf8nXnznu5UNEPlKIoBPZGGyTF2VnYfEUEAHfXPAqeECTkZzwUU1gnfFVCcoHXzZVofusdLWwYxcQ/6K5JsDTr55lteKh5ZXDAxkZPFmSsKJSA553cSyoAMlTUfXaNHqtLDkoW/AwaP9MYf/YH/qNXI7Ky+nmbDRjALzgUMkq8BjZeUiLUCRAmuGKVS0EqwEbSFH4m5BVfQHzqmyNulzNSWtIdGCuvhwfxrPHv0PGvVQqMh/DmbNrGIw/Tll0/oF3nMtAfEaQ5iuoNPy/Xyvbda9vBKjFZ0E602Usff6OCJldTYXzsp1OuVUpCJfiZXwaXccnSMFODl2597VQf8rczyTnypE3mupXrL5zN23BiYk9eurE9jxlB8VipzAoSjrbi6vGnFQCUqKkd99OfFtX0pZBJN5Pq/r/p96k2iuEdDks0Gnwa7RYA4ry6uGwf8cTidp/qdvpRVXSOT9sm5I3JvTPR8diebOrpnquhh0WZML/EJnhcf2q0kUNQOCYMOQBDhpv10bK2PX3zEsmeFDtWCR2gLWHc80oP/KWImJ5lSeoywH/SI/2FLjwL184cDE8Z2zGtwC2po6sKKxCsrILfx+4RLqQ43oIdMwL+TGpuI53OmP1g/ZNuzzi45lhmYaRV1XSGutHe/Pq0Ti7WlZaWelHML3Eniu0WVunOfBN59vx55tH6Dv1K/4bGkt3pgzBT1XuhC+fAFWOTOzKyZXlWUDCz02MOdv5SDQ2eyOF1/cdSP9x7YnRBQU01y/OMR4bQy+OnkJSvQGpre04aUnZ5rDeQ2HusNMLSdjf9ytrGt0t4dErjtT0kAOD2Rw8HYG50eLc0fyEt4+m0KZE80KUJlqdjzvh2f5OvwSs1EpTWa6m2MulZzY3CvQ6hcsP/RNrL6bu9+jxEdHyEe3gpsj6ckesDB4OmSf7PBKo7cHLFgZIFhWZwVPM6Cmt/ptiqHSqpDKFmHEMhWeoYfreNwHioWxkn7y37T0bt94eW4kK6OlTsT1WEl9odE13OS1WWIFjSQlrcFr49hoTmbppjE8FrZ7RZ1jzxQrC41OCBONS7g/aAx+G8pMuTkhNdeKvItwmJMt6Z0fL/X1mMUUn2ZdwrHB0vZ6gfWdieTPVdv5zp5E+WZrtU2d5rCArXCrzNyjMoJHaP8LMAD3RyhPi7Aw4AAAAABJRU5ErkJggg==",
            total: icon_counter.total,
            total_short: icon_counter.total_short
        };

    	compiledTpl = _.template(iconTpl, icon_config);

        $dv
        	.addClass("privdog-netapp")
            .attr("unselectable", "on")
        	.html(compiledTpl)
        	.on('click', function () {
	            _scope_.panel.open(_scope_.response);
	        });

        $(document.body).append($dv);

        try {
            $($dv.get(0).childNodes).attr("unselectable", "on");
        } catch (e) {}

        window.setInterval(function () {
            _scope_.updateInfo();
        }, _scope_.response.ti * 1000);
    };

    _scope_.changeData = function () {
        _scope_.fixResponse();
        _scope_.viewIconInfo();

        if (_scope_.panel !== null) {
            _scope_.panel.setData(_scope_.response);
        }    
    },

    _scope_.updateInfo = function () {
        var runByEmptyPage,
            runByNetApp;

        runByEmptyPage = function () {
            var response = {
                "2": {
                    wasBlocked: 210,
                    wasAllow: 220,
                    domains: [
                        {
                            domain: "a.com",
                            total: 24
                        },
                        {
                            domain: "b.com",
                            total: 22
                        },
                        {
                            domain: "c.com",
                            total: 20
                        }
                    ]
                },
                "3": {
                    wasBlocked: 310,
                    wasAllow: 320,
                    domains: [
                        {
                            domain: "a.com",
                            total: 34
                        },
                        {
                            domain: "b.com",
                            total: 32
                        },
                        {
                            domain: "c.com",
                            total: 30
                        }
                    ]
                },
                to: parseInt(Math.random() * 100, 10),
                ti: 10
            };

            response = JSON.stringify(response);
            _scope_.response = JSON.parse(response);
            _scope_.changeData();
        };

        runByNetApp = function () {
            $http.get(function(response) {
                try {
                    _scope_.response = JSON.parse(response);
                    _scope_.changeData();
                } catch (e) {
                    console.log("RESPONSE: BAD PARSE");
                }
            });
        };

        switch (_scope_.mode) {
            case 0:
                runByEmptyPage();
                break;

            default:
                runByNetApp();
                break;
        }
    };

    _scope_.docReady = function (callback) {
        if(document.body) {
            callback();
            $.addEvent(window, "load", _scope_.updateInfo);
        } else {
            $.addEvent(window, "load", callback);
            $.addEvent(window, "DOMContentLoaded", callback);
        }
    };

    _scope_.canInject = function () {
        if (window.chrome && window.chrome.searchBox && (!window.chrome.searchBox.displayInstantResults)) {
			return false;
		}
        
		if (window.self !== window.top) {
			return false;
		}
		
		return true;
    };

	if (_scope_.canInject()) {
        try {
            console.log("PrivDog's script version: " + _scope_.version);
        } catch (e) {}

        var runByNetApp = function () {
            $http.get(function(response) {
                try {
                    _scope_.response = JSON.parse(response);
                    _scope_.changeData();
                } catch (e) {
                    console.log("RESPONSE: BAD PARSE");
                }

                _scope_.run('render');
            });
        };

        var netAppOff = function () {
            var response;

            response = {
                "1": {
                    wasBlocked: 110,
                    wasAllow: 120,
                    domains: [
                        {
                            domain: "a.com",
                            total: 14
                        },
                        {
                            domain: "b.com",
                            total: 12
                        },
                        {
                            domain: "c.com",
                            total: 10
                        }
                    ]
                },
                "2": {
                    wasBlocked: 210,
                    wasAllow: 220,
                    domains: [
                        {
                            domain: "a.com",
                            total: 24
                        },
                        {
                            domain: "b.com",
                            total: 22
                        },
                        {
                            domain: "c.com",
                            total: 20
                        }
                    ]
                },
                "3": {
                    wasBlocked: 310,
                    wasAllow: 320,
                    domains: [
                        {
                            domain: "a.com",
                            total: 34
                        },
                        {
                            domain: "b.com",
                            total: 32
                        },
                        {
                            domain: "c.com",
                            total: 30
                        }
                    ]
                },
                "4": {
                    wasBlocked: 410,
                    wasAllow: 420,
                    domains: [
                        {
                            domain: "a.com",
                            total: 44
                        },
                        {
                            domain: "b.com",
                            total: 42
                        },
                        {
                            domain: "c.com",
                            total: 40
                        }
                    ]
                },
                to: 5000,
                bs: 1000,
                ti: 50
            };

            _scope_.response = response;

            _scope_.run('render');
        };

        _scope_.docReady(function () {
            if(_scope_.inject) {
                return;
            }
            _scope_.inject = true;

            switch (_scope_.mode) {
                case 2:
                    runByNetApp();
                    break;

                default:
                    netAppOff();
            }
        });
	}
}


module.exports = {
	module: Icon
};
},{}],5:[function(require,module,exports){
function Panel (_scope_, $http, $dom, _, panelTpl) {
	var $ = $dom,
		image,
		animate_config;

	animate_config = {
		move: {
			start: [{
				property : "right",
				from     : -362,
				to       : 2,
				step     : 18.2,
				unit     : "px"
			}],
			end: [{
				property : "bottom",
				from     : 2,
				to       : -362,
				step     : -18.2,
				unit     : "px"
			}]
		}
	};	

	image = {
		panel_logo: "data:image/png;base64,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",
		panel_option: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkVEMEI1NUVBOTA3MTFFMjg2NENGMkE5QjAyQkM0RjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkVEMEI1NUZBOTA3MTFFMjg2NENGMkE5QjAyQkM0RjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRUQwQjU1Q0E5MDcxMUUyODY0Q0YyQTlCMDJCQzRGMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRUQwQjU1REE5MDcxMUUyODY0Q0YyQTlCMDJCQzRGMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnAbhCoAAAKCSURBVHjarJU7aBRRFIZndpNNMsZH3LVQ8QGCjQ+0SGEQFRRFBC3FQhS08FHZBMRCLGwkpRo7QaOiEUVBRRQEQRAfKBZBIYWuoBA3Ju7qGpN9+B/4Bi7j7GYKL3zM5s6cc//7n3Nv/Gw26yUYS8VO8V1cF1Phi0KhEBvQ4iUbe8VxURYfxMvpAlIJks4Xu8SE6BAHRMb9IJfL/SPQj1ixVpwSD1DVI3ZjxU+EBOKtuCZGxR5hSY7Ilk9xiU3ZPbGagHGxUJTED1eMmCtascZ2MVtcVuJ9jTxOiy8UJ+B3jWTuGCU2zU5qPGM9/ipuijmiipoayjpRNUvMIGlFTOL3L3G3WVfUWawObah9J97z/SqxjPkpFpiHz7HFM98eW5HFb5KY2gHzT4yw6GJxWGxnV1WSvrLukc+TYeIuPbtpo41OoWz+oTgqipGdLRIXxQre2e5mitfihrifDoKgVz/OiyWcrLDy5uVJMRTT20V834pqD0tWspN8C8o8qlp3OsAKl29ycPLOtz6xZezKpPDmhVPhsHDm77omiXsiRc/Q85ZryKywlZ+guJsVw95dI56Kb5Gk28QJ8QcL2ok/Iy7YfeJ2hZ2gK2K9GENFF93QL56zmCU9SCsWOSSW5JI64lhcH1uL3RFbHNVjJD9Nz/okKpE0xd82HjU6efbBcvoyLKLPqRqhDcexZYLYUIA9N7i3nKvY2msHyjrwrUKlKyRwCxUwV2V+E/OVqOISVtj4LAbFm7B9nG5pJ9kzcVUMs5sBeVyOU2xBZ7m5hgm0e3iz2I/XPu/76aSPtOQCcbvZRd9o9IlDJD4nev/X/7xB1FviW0kCkir2uPXCS74+neK/AgwALRu5bJAZX6QAAAAASUVORK5CYII="
	};

	_scope_.$container      = null;
	_scope_.update_interval = null;

	_scope_.toInt = function (val) {
		val = parseInt(val, 10);

		if (window.isNaN(val)) {
			val = 0;
		}

		return val;
	};

	_scope_.getHTML = function () {
		var response,
			tmpl,
			config,
			convertData = function (arr) {
				var temp = {},
					i,
					res = [];

				if (!arr) {
					return res;
				}

				for (i = 0; i < arr.length; ++i) {
					if (typeof temp[arr[i]] === "undefined") {
						temp[arr[i]] = 0;
					}

					++temp[arr[i]];
				}

				for (i in temp) {
					if (!temp.hasOwnProperty(i)) {
						continue;
					}

					res.push({name: i, count: temp[i]});
				}

				return res;
			};

		response = _scope_.response;

		var total_page = _scope_.toInt(response["1"].wasAllow) + 
				_scope_.toInt(response["1"].wasBlocked) +
				_scope_.toInt(response["2"].wasAllow) + 
				_scope_.toInt(response["2"].wasBlocked) +
				_scope_.toInt(response["3"].wasAllow) + 
				_scope_.toInt(response["3"].wasBlocked) +
				_scope_.toInt(response["4"].wasAllow) + 
				_scope_.toInt(response["4"].wasBlocked);
		
		config = {
			logo          : image.panel_logo,
			options       : image.panel_option,

			an            : response["1"].domains,
			tr            : response["2"].domains,
			wi            : response["3"].domains,
			st            : response["4"].domains,

			trackers      : _scope_.toInt(response["2"].wasAllow) + _scope_.toInt(response["2"].wasBlocked),
			party_widgets : _scope_.toInt(response["3"].wasAllow) + _scope_.toInt(response["3"].wasBlocked),
			statistic     : _scope_.toInt(response["4"].wasAllow) + _scope_.toInt(response["4"].wasBlocked)
		};

		tmpl = _.template(panelTpl);

		return tmpl(config);
	};

	_scope_.getWinDocFrame = function () {
		var $dv,
			$iframe,
			win,
			doc;

		$dv = _scope_.$container;

		if ($dv === null) {
			return {
				win: null,
				doc: null
			};
		}

		$iframe = $($dv.get(0).getElementsByTagName("iframe")[0]);

		win = $iframe.el[0].contentWindow;
		doc = win.document;

		return {
			win: win,
			doc: doc
		};
	};

	_scope_.getList = function (data) {
		var html = '',
			i;

		html += '<table style="width: 100%;">';


		for (i = 0; i < data.length; ++i) {
			html += '<tr><td style="padding-left:20px;font-size:12px;color: #777777;">' + data[i].domain + '</td><td style="width: 90px;font-size:12px;color: #777777;"><b>' + data[i].total + '</b> requests</td></tr>';
		}
		
		html += "</table>";

		return html;
	};

	_scope_.getData = function () {
		var response,
			total_page,
			config;

		response = _scope_.response;	

		total_page = _scope_.toInt(response["1"].wasAllow) + 
			_scope_.toInt(response["1"].wasBlocked) +
			_scope_.toInt(response["2"].wasAllow) + 
			_scope_.toInt(response["2"].wasBlocked) +
			_scope_.toInt(response["3"].wasAllow) + 
			_scope_.toInt(response["3"].wasBlocked) +
			_scope_.toInt(response["4"].wasAllow) + 
			_scope_.toInt(response["4"].wasBlocked);
		
		config = {
			ad_view               : '',
			tr_view               : '',
			wi_view               : '',
			st_view               : '',
			ad_network_total      : _scope_.toInt(response["1"].wasAllow) + _scope_.toInt(response["1"].wasBlocked),
			trackers_total        : _scope_.toInt(response["2"].wasAllow) + _scope_.toInt(response["2"].wasBlocked),
			party_widgets_total   : _scope_.toInt(response["3"].wasAllow) + _scope_.toInt(response["3"].wasBlocked),
			statistic_total       : _scope_.toInt(response["4"].wasAllow) + _scope_.toInt(response["4"].wasBlocked),
			//threats_found         : total_page,
			threats_found         : _scope_.toInt(response.bs),
			session_counter_total : _scope_.toInt(response.to)
		};

		config.ad_view += _scope_.getList(response["1"].domains);
		config.tr_view += _scope_.getList(response["2"].domains);
		config.wi_view += _scope_.getList(response["3"].domains);
		config.st_view += _scope_.getList(response["4"].domains);

		return config;
	};

	_scope_.setValue = function () {
		var win,
			doc,
			total_page,
			item,
			temp,
			data;

		temp = _scope_.getWinDocFrame();

		win = temp.win;
		doc = temp.doc;

		data = _scope_.getData();

		for (item in data) {
			if (!data.hasOwnProperty(item)) {
				continue;
			}

			$(doc.getElementById(item)).html(data[item]);
		}

		if (data.ad_network_total === 0) { 
			$(doc.getElementById("li_ad_view"))
				.addClass("empty-list")
				.removeClass("list-open")
				.addClass("list-close");

			$(doc.getElementById("ad_view"))
				.css({"display": "none"});
		} else {
			$(doc.getElementById("li_ad_view")).removeClass("empty-list");
		}

		if (data.trackers_total === 0) {
			$(doc.getElementById("li_tr_view"))
				.addClass("empty-list")
				.removeClass("list-open")
				.addClass("list-close");

			$(doc.getElementById("tr_view"))
				.css({"display": "none"});
		} else {
			$(doc.getElementById("li_tr_view")).removeClass("empty-list");
		}

		if (data.party_widgets_total === 0) {
			$(doc.getElementById("li_wi_view"))
				.addClass("empty-list")
				.removeClass("list-open")
				.addClass("list-close");

			$(doc.getElementById("wi_view"))
				.css({"display": "none"});
		} else {
			$(doc.getElementById("li_wi_view")).removeClass("empty-list");
		}

		if (data.statistic_total === 0) {
			$(doc.getElementById("li_st_view"))
				.addClass("empty-list")
				.removeClass("list-open")
				.addClass("list-close");

			$(doc.getElementById("st_view"))
				.css({"display": "none"});
		} else {
			$(doc.getElementById("li_st_view")).removeClass("empty-list");
		}

		return true;
	};

	_scope_.onClickList = function (elem, win) {
		var $this = $(elem), 
			id,
			el,
			$el,
			config,
			el_height;

		id = $this.attr("data-view");	
		el = win.document.getElementById(id);

		if (!el) {
			return;
		}

		$el = $(el);

		$el.css({
			overflow: "hidden"
		});

		if ($this.hasClass("list-open")) {
			$this
				.removeClass("list-open")
				.addClass("list-close");

			$el.css({
				height: "auto"
			});	

			el_height = parseInt($el.cssVal("height"), 10);
			
			if (window.isNaN(el_height)) {
				el_height = parseInt($el.get(0).offsetHeight);
			}

			if (window.isNaN(el_height)) {
				el_height = 0;
			}

			config = [{
				property : "height",
				from     : el_height,
				to       : 0,
				step     : - el_height / 20,
				unit     : "px"
			},];

			$(el).animate(config, 10, function () {
				$el.css({
					display: "none" 
				});
			});
		} else {
			$this
				.removeClass("list-close")
				.addClass("list-open");

			$el.css({
				display: "block",
				height: "inherit"
			});

			el_height = parseInt($el.cssVal("height"), 10);
			
			if (window.isNaN(el_height)) {
				el_height = parseInt($el.get(0).offsetHeight);
			}

			if (window.isNaN(el_height)) {
				el_height = 0;
			}

			config = [{
					property : "height",
					from     : 0,
					to       : el_height,
					step     : el_height / 20,
					unit     : "px"
				}];

			$(el).animate(config, 10, function () {});
		}
	};

	_scope_.view = function (callback) {
		var config = JSON.parse(JSON.stringify(animate_config.move.start));

		if(typeof config === 'string') {
			config = JSON.parse(config);
		}

		_scope_.$container.animate(config, 10, function () {
			if (typeof callback === "function") {
				callback();
			}
		});
	};

	_scope_.setData = function (data) {
		_scope_.response = data;
		_scope_.reDraw();
	};

	_scope_.reDraw = function () {
		if (_scope_.$container === null) {
			return;
		}

		_scope_.setValue();
	};

	_scope_.close = function (callback) {
		var config = JSON.parse(JSON.stringify(animate_config.move.end));

		if(typeof config === 'string') {
			config = JSON.parse(config);
		}

		_scope_.$container
			.stop()
			.animate(config, 10, function () {
				if (_scope_.$container !== null) {
					_scope_.$container.remove();
					_scope_.$container = null;
				}

				if (typeof callback === "function") {
					callback();
				}
			});
	};

	_scope_.drawFrameBody = function () {
		var win,
			doc,
			temp;

		temp = _scope_.getWinDocFrame();
		win = temp.win;
		doc = temp.doc;

		if (win === null || doc === null) {
			return;
		}

		doc.open();
		doc.close();

		$(doc.body).html(_scope_.getHTML());
		_scope_.setValue();

		$(doc.body.getElementsByTagName("li")).on("click", function (e) {
			var el;
			var target = e.target ? e.target : e.srcElement;

			if(target.tagName == 'LI') {
				el = target;
			}else if(target.parentNode.tagName == 'LI') {
				el = target.parentNode;
			}

			_scope_.onClickList(el, win);
		});

		$.addEvent(doc.getElementById("optionsButton"), 'click', function() {
			_scope_.close();
			$http.options();
		});
	};

	_scope_.createFrame = function () {
		var $iframe  = $("<iframe/>"),
			$dv      = $("<div/>"),
			win;

		if (_scope_.$container !== null) {
			_scope_.$container.remove();
			_scope_.$container = null;
		}

		$iframe.attr('frameborder', '0');

		$(document.body).append($dv);
		$dv.append($iframe);

		$dv.css({
			"background-color" : "white",
			"box-sizing"       : "content-box",
			position           : "fixed",
			bottom             : "2px",
			right              : "2px",
			width              : "362px",
			height             : "330px",
			zIndex             : "99999999",
			overflow           : "hidden"
		});

		$iframe.css({
			"box-sizing"       : "content-box",
			width  : "360px",
			height : "328px",
			border : "1px solid #777777"
		});

		_scope_.$container = $dv;

		_scope_.view(function() {
			$dv.on('mouseout', function () {
				_scope_.close();
			});
		});

		_scope_.drawFrameBody();		
	};

	var open = function (response) {
		_scope_.response = response;
		_scope_.createFrame();
	};

	return {
		open: open,
		setData: _scope_.setData
	};
}

module.exports = {
	module: Panel
};
},{}],6:[function(require,module,exports){
function $dom() {
	var DOM,

		methods,

		convertCSSAttr = function (attr_name) {
			var temp = attr_name.split('-'),
				i;

			for (i = 1; i < temp.length; ++i) {
				temp[i] = temp[i][0].toUpperCase() + temp[i].substring(1);
			}

			return temp.join('');
		};

	DOM = function (el) {
		if (!(this instanceof DOM)) {
			return new DOM(el);
		}

		this.init(el);

		return this;
	};

	DOM.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};

	DOM.isHTMLCollection = function (arg) {
		return (Object.prototype.toString.call(arg) === '[object HTMLCollection]' || Object.prototype.toString.call(arg) === '[object NodeList]');	
	};

	DOM.addEvent = function (element, event, callback) {
		if (typeof element.addEventListener !== "undefined") {
			element.addEventListener(event, callback, false);
		} else {
			if (typeof element.attachEvent !== "undefined") {
				element.attachEvent("on" + event, callback);
			} else {
				element["on" + event] = callback;
			}
		}

	};

	DOM.prototype = {
		remove: function () {
			if (!DOM.isArray(this.el)) {
				return false;
			}

			this.el.forEach(function (el, i, arr) {
				try {
					el.parentNode.removeChild(el);
				} catch (e)	{}
			});

			return true;
		},

		selector: function (sel) {
			var res;

			if (typeof document.querySelectorAll !== "undefined") {
				return document.querySelectorAll(sel);
			}

			if (sel[0] === '#') {
				res = document.getElementById(sel.substring(1));

				if (!res)

				return [];
			}

			return document.getElementsByTagName(sel);
		},

		create: function (tagname) {
			return [document.createElement(tagname)];
		},

		css: function (obj) {
			this.el.forEach(function (el, i, arr) {
				var item;

				for (item in obj) {
					if (!obj.hasOwnProperty(item)) {
						continue;
					}

					if (!el || typeof el.style === "undefined") {
						continue;
					}

					el.style[item] = obj[item];
				}
			});
		},

		cssVal: function (property) {
			var val = null,
				computed;

			if (typeof window.getComputedStyle !== "undefined") {
				computed = window.getComputedStyle(this.el[0], null);
			} else {
				computed = this.el[0].currentStyle;
			}

			val = computed[property];

			return val;
		},

		html: function (html) {
			this.el.forEach(function (el, i, arr) {
				try {
					if (window.attachEvent && !window.addEventListener) {
						el.innerHTML = "_" + html;
						el.firstChild.data = el.firstChild.data.substring(1);
					} else {
						el.innerHTML = html;
					}
				} catch (e) {
					el.innerText = html;
				}
			});	

			return this;
		},

		append: function ($el) {
			this.el.forEach(function (el, i, arr) {
				if (!!el && typeof el.appendChild !== "undefined") {
					el.appendChild($el.el[0]);
				}
			});
		},

		attr: function (name, value) {
			var data,
				item;

			if (!this.el) {
				return this;
			}

			if (typeof value === "undefined") {
				if (!!this.el && !!this.el[0]) {
					return this.el[0].getAttribute(name);
				} else {
					return null;
				}
			}

			if (typeof name === "string") {
				this.el.forEach(function (el, i, arr) {
					if (!!el.setAttribute) {
						el.setAttribute(name, value);
					}
				});	

				return this;
			}

			data = name;

			for (item in data) {
				if (!data.hasOwnProperty(item)) {
					continue;
				}

				this.attr(item, data[item]);
			}

			return this;
		},

		get: function (num) {
			return this.el[num] || null;
		},

		on: function (event, callback) {
			if(this.el.toString() == "[object HTMLCollection]") {
				var l = this.el[0].length;
				for(var i = 0; i < l; i++) {
					DOM.addEvent(this.el[0][i], event, callback);
				}
			} else {

				this.el.forEach(function (el, i, arr) {
					DOM.addEvent(el, event, callback);
				});
			}
		},

		off: function (event, callback) {
			this.el.forEach(function (el, i, arr) {
				el.removeEventListener(event, callback, false);
			});
		},

		length: function () {
			try {
				return this.el.length;
			} catch(e) {
				return 0;
			}	
		},

		stop: function () {
			window.clearTimeout(this.animate_timeout);

			return this;
		},

		animate: function (config, interval, callback) {
			var _this = this,
				css = {},
				i,
				change_flag = false,
				cur_val;

			for (i = 0; i < config.length; ++i) {

				if(typeof config[i] === 'undefined') {
					continue;
				}

				cur_val = this.cssVal(config[i].property);

				if (cur_val !== null) {
					cur_val = parseFloat(cur_val);
				}

				if (cur_val !== null && !window.isNaN(cur_val)) {
					if (config[i].step > 0 && cur_val > config[i].from && cur_val < config[i].to) {
						config[i].from = cur_val;
					}

					if (config[i].step < 0 && cur_val < config[i].from && cur_val > config[i].to) {
						config[i].from = cur_val;
					}
				}

				css[config[i].property] = config[i].from.toFixed(4) + config[i].unit;

				if ((config[i].step > 0 && config[i].from + config[i].step / 10 < config[i].to)
					|| (config[i].step < 0 && config[i].from + config[i].step / 10 > config[i].to)) {
					config[i].from += config[i].step;
					
					change_flag = true;
				}
			}

			this.css(css);

			if (change_flag) {
				this.animate_timeout = window.setTimeout(function () {
					_this.animate(config, interval, callback);
				}, interval);
			} else {
				if (typeof callback === "function") {
					callback();
				}
			}

			return this;
		},

		parent: function () {
			if (!this.el) {
				return null;
			}

			if (!this.el[0]) {
				return null;
			}

			return new DOM(this.el[0].parentNode);
		},

		hasClass: function (class_name) {
			var flag = false;

			class_name = ' ' + class_name + ' ';

			this.el.forEach(function (el, i, arr) {
				var node_class = el.className;

				if ((' ' + node_class + ' ').indexOf(class_name) !== -1) {
					flag = true;
				}
			});

			return flag;
		},

		addClass: function (class_name) {
			var _this = this;

			this.el.forEach(function (el, i, arr) {
				if (!_this.hasClass(class_name)) {
					var node_class = el.className;

					node_class = node_class.replace(/\s+/gi, ' ');
					node_class = node_class.split(' ');
					node_class.push(class_name);

					el.className = node_class.join(' ');
				}
			});

			return this;
		},

		removeClass: function (class_name) {
			var _this = this;

			this.el.forEach(function (el, i, arr) {
				if (_this.hasClass(class_name)) {
					var node_class = el.className,
						i;

					node_class = node_class.replace(/\s+/gi, ' ');
					node_class = node_class.split(' ');

					for (i = 0; i < node_class.length; ++i) {
						if (node_class[i] === class_name) {
							node_class.splice(i, 1);
							--i;
						}
					}

					el.className = node_class.join(' ');
				}
			});

			return this;
		},

		init: function (el) {
			var re_tag = /^<(\S+)\/>$/gi,
				res,
				tag;

			var toArray = function(obj) {
				var array = [];
				for (var i = obj.length >>> 0; i--;) { 
					array[i] = obj[i];
				}
				return array;
			};

			if (typeof el !== "string") {
				if (DOM.isArray(el)) {
					this.el = el;
				} else {
					if (DOM.isHTMLCollection(el)) {
						this.el = Array.prototype.slice.call(el);
					} else {
						this.el = [el];
					}
				}

				return;
			}

			re_tag.lastIndex = 0;
			res = re_tag.exec(el);
			
			if (!!res && res[1]) {
				tag = res[1];

				this.el = this.create(tag);

				return;
			}

			this.el = this.selector(el);
			this.el = toArray(this.el);
			this.el = Array.prototype.slice.call(this.el);
			
			if(!Array.prototype.forEach) {
				Array.prototype.forEach = function (fn, scope) {
					for (var i = 0, len = this.length; i < len; ++i) {
						fn.call(scope || this, this[i], i, this);
					}
				}
			}
		}
	};

	return DOM;
}


module.exports = {
	module: $dom
};
},{}],7:[function(require,module,exports){
function $http (_) {
	var domain = window.location.host, //"127.0.0.1:44",
		ajax,
		extend;

 	extend = function (child, parent, deep) {
        var i,
            toStr = Object.prototype.toString,
            astr = "[object Array]";

        child = child || {};

        if (typeof deep === "undefined") {
            deep = true;
        }

        for (i in parent) {
            if (!parent.hasOwnProperty(i)) {
                continue;
            }

            if (deep) {
                if (typeof parent[i] === "object") {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};

                    extend(child[i], parent[i]);
                } else {
                    child[i] = parent[i];
                }
            } else {
                child[i] = parent[i];
            }
        }

        return child;
    };	

	ajax = function (options) {
        var opt = {
            url      : "",
            data     : null,
            async    : true,
            success  : false,
            error    : false,
            funcdata : false,
            type     : "GET"
        };

        opt = extend(opt, options);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            var response;

            if (xhr.readyState == 4) {
                if (xhr.status !== 200) {
                    if (typeof opt.error === "function") {
                        opt.error(xhr.status);
                    }    

                    return;
                }

                response = xhr.responseText;

                if (!!response) {
                    if (typeof opt.success == "function") {
                        if (!!opt.funcdata) {
                            opt.success(response,opt.funcdata);
                        } else {
                            opt.success(response);
                        }
                    }
                }
            }
        };

        xhr.open(opt.type, opt.url, opt.async);

        if (opt.type.toLowerCase() === "post") {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        xhr.send(opt.data);
    };
    

	return {
		get: function(callback) {
			var opt = {
				url: (window.location.protocol + '//' + domain + '/priv.dog.settings/GetStatistics?date=' + _.now()),
				success: callback
			};

			ajax(opt);
		},
		options: function () {
			var opt = {
				url: (window.location.protocol + '//' + domain + '/priv.dog.gui/options')
			};

			ajax(opt);
		}
	};


}


module.exports = {
	module: $http
};
},{}],8:[function(require,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}]},{},[1])