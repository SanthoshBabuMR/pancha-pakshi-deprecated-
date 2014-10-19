define( [ "knockout", "moment", "util", "knockoutPostbox" ], function( ko, moment, util ) {
  // private moment object instance

  var publishView = "timePickerShowView";
  var instanceCount = 0;
  function init( node, options ) {
    instanceCount = instanceCount + 1;
    var momentObject = options.timeObj || moment();
    var publishViewForInstance = publishView+instanceCount;
    var koNow = ko.observable( moment() );
    var koTime = ko.observable();
    var koTimeFormat = ko.observable();
    var timeFormat = 12;
    var self = {};

    self.count = function() {
      return instanceCount;
    }
    self.currentTime = ko.computed( function() {
      return koNow();
    })
    self.updateToCurrentTime = function() {
      momentObject = moment()
      koTime( momentObject );
      self.closeView();
    }
    self.selectedTime = ko.computed( function() {
      return koTime();
    } );
    self.timeFormat = ko.computed( function() {
      return koTimeFormat();
    } );
    self.update = function( options ) {
      if( _.isUndefined( options ) ) {
        options = {};
      }
      koNow( moment() );
      koTime( options.timeObj || momentObject );
      koTimeFormat( options.format || timeFormat )
    }
    self.setHour = function( h ) {
      var meridian = momentObject.format('a');
      var hour = h;
      if(  hour === 12 ) {
        hour = ( meridian === "am" ) ? 0 : h;
      }
      momentObject.set( 'hour', hour  );
      self.update();
    }
    self.setMinute = function( m ) {
      momentObject.set( 'minute', m );
      self.update();
    }
    self.setSecond = function( s ) {
      momentObject.set( 'second', s );
      self.update();
    }
    self.setMeridian = function( a ) {
      var meridian = a;
      var momentMeridian = momentObject.format('a')
      var hour = momentObject.hours();
      if( meridian === momentMeridian ) {
        return;
      }
      if( meridian === "pm" ) {
        hour = hour === 0 ? 12 : hour + 12;
      }
      else if( meridian === "am" ) {
        hour = hour === 12 ? 0 : hour - 12;
      }
      momentObject.hours( hour )
      self.update();
    }
    /**
     * begin: pub sub to show/hide view
     */
    self[publishViewForInstance] = ko.observable().subscribeTo( publishViewForInstance, function( viewType ) {
      return viewType;
    });
    self.showHoursMenu = function() {
      window.arg = arguments;
      ko.observable( "show-hours-panel" ).publishOn(publishViewForInstance);
    }
    self.showMinutesMenu = function() {
      ko.observable( "show-minutes-panel" ).publishOn(publishViewForInstance);
      self.shrinkMinutes();
    }
    self.showMeridianMenu = function() {
      ko.observable( "show-meridian-panel" ).publishOn(publishViewForInstance);
    }
    self.closeView = function() {
     ko.observable( "hide" ).publishOn(publishViewForInstance);
    }
    /**
     * begin: pub sub to show/hide view
     */
    self.increase = function ( type ) {
      switch( type ) {
        case 'h': {
          self.setHour( momentObject.hour() + 1  )
          break;
        }
        case 'm': {
          self.setMinute( momentObject.minute() + 1  )
          break;
        }
        case 's': {
          self.setSecond( momentObject.second() + 1  )
          break;
        }
        case 'a': {
          self.setMeridian( "pm" )
          break;
        }
      }
    }
    self.decrease = function ( type ) {
       switch( type ) {
        case 'h': {
          self.setHour( momentObject.hour() - 1  )
          break;
        }
        case 'm': {
          self.setMinute( momentObject.minute() - 1  )
          break;
        }
        case 's': {
          self.setSecond( momentObject.second() - 1  )
          break;
        }
        case 'a': {
          self.setMeridian( "pm" )
          break;
        }
      }
    }
    self.hoursList = (function(){
      var h = [];
      for( var i=1; i<13; i++) {
        h.push( util.padZero( i ) );
      }
      return h;
    } ());
    self.minutesList = (function(){
      var m = [];
      var groupArray = []
      /*for( var i=0; i<60; i=i+5) {
        m.push( util.padZero( i ) );
        console.log( m )
        if( m.length === 4 ) {
          groupArray.push( m )
          m = [];
        }
      }*/
      for( var i=0; i<60; i=i+5) {
        groupArray.push( util.padZero( i ) );
      }
      return groupArray;
    } ());
    self.meridianList = [ "am", "pm" ];

    self.expandMinutes = function( index ) {
      if( $(".minutes-group").length > 0 ){
        $(".minutes-group").hide();
        $( $(".minutes-panel").find(".row").not(".minutes-group")[index()] ).show();
      }
    }
    self.shrinkMinutes = function( index ) {
      if( $(".minutes-group").length > 0 ){
        $(".minutes-group").show();
        $( $(".minutes-panel").find(".row").not(".minutes-group") ).hide();
      }
    }
    
    if( node ) {
      var htmlText = $(node).html();
      $(node).empty().html( htmlText.replace( new RegExp( publishView, "g" ), publishViewForInstance ) );
    }
    if( options ) {
      self.update( options )
    }
    ko.observable( "hide" ).publishOn(publishViewForInstance);
    return self;
  }

  return {
    init: init
  };

} );
