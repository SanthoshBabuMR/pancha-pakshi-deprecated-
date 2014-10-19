requirejs.config( {
	  baseUrl: "/public/script"
	, paths : {
		"requireJS": "vendor/require",
		"jquery": "vendor/jquery-2.1.1.min",
		"moment": "vendor/moment-with-locales.min",
		"knockout": "vendor/knockout-3.2.0",
		"knockoutPostbox": "vendor/knockout-postbox",
		"underscore": "vendor/underscore-min",
		"i18n": "vendor/i18n",
		"text": "vendor/text",

		"sastram": "../db/sastram.json",
	    "disp": "module/disp",
	    "util": "module/util",
	    "main": "module/main",
	    "core": "module/core",
	    "calender": "module/calender",
      "time": "module/time"

	  }
	, shim: {

	  }
	, urlArgs : "bust=" + ( new Date() ).getTime()

} );

require( [ "main" ] );
