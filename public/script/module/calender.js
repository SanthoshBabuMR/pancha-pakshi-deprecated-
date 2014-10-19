define( [ "knockout", "moment", "util", "knockoutPostbox" ], function( ko, moment, util ) {
  
  var publishView = "calenderShowView";
  var instanceCount = instanceCount? instanceCount+1 : 0;
  function init( options, node ) {
    // private moment object instance
    var momentObject = moment();
    instanceCount = instanceCount + 1;
    var publishViewForInstance = publishView+instanceCount;
    var koDate = ko.observable();
    var koToday = ko.observable( moment() );
    var koYearList = ko.observableArray();
    var koMonthList = ko.observableArray();
    var koDateList = ko.observableArray();
    var koDayList = ko.observableArray();
    var datePattern = "DD";
    var monthPattern = "MMMM";
    var yearPattern = "YYYY";
    var dayPattern = "ddd";

    var dayArray = [ "sunday","monday","tuesday","wednesday","thursday","friday","saturday" ];
    var dayArrayIndex = [ 0, 1, 2, 3, 4, 5, 6 ];
    var monthArray = [ "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november","december" ];
    var monthArrayIndex = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];


    var self = {};
    self.count = function() {
      return instanceCount;
    }
    self.date = ko.computed( function() {
      return koDate();
    } );
    self.today = ko.computed( function() {
      return koToday();
    })
    self.dateView = ko.computed( function() {
      return koDateList();
    } );
    self.monthView = ko.computed( function() {
      return koMonthList();
    } );
    self.yearView = ko.computed( function() {
      return koYearList();
    } );
    self.dayView = ko.computed( function() {
      return koDayList();
    } );
    self.calenderFormat = function( pattern ) {
      if( pattern.date ) {
        dateView();
      }
      if( pattern.month ) {
        monthView();
      }
      if( pattern.year ) {
        yearView();
      }
      if( pattern.day ) {
        dayView();
      }
    }
    self.updateToToday = function() {
      momentObject = moment();
      koDate( momentObject );
      self.closeView();
    }
    /**
     * begin: pub sub to show/hide view
     */
    self[publishViewForInstance] = ko.observable().subscribeTo( publishViewForInstance, function( viewType ) {
      return viewType;
    });
    self.selectedDate = function() {
      ko.observable( "show-date-panel" ).publishOn(publishViewForInstance);
    }
    self.selectedMonth = function() {
      ko.observable( "show-month-panel" ).publishOn(publishViewForInstance);
    }
    self.selectedYear = function() {
      ko.observable( "show-year-panel" ).publishOn(publishViewForInstance);
    }
    self.closeView = function() {
     ko.observable( "hide" ).publishOn(publishViewForInstance);
    }
    /**
     * end: pub sub to show/hide view
     */
    self.updateDate = updateDate;
    self.updateMonth = updateMonth;
    self.updateYear = updateYear;
    self.yearGroup = function( yGroup ) {
      yearView( yGroup );
    }
    function formatMonth( monthIndex, pattern ) {
      var monthAsPattern;
      switch( pattern || monthPattern ) {
          case "M": {
            monthAsPattern = monthIndex
            break;
          }
          case "MM": {
            monthAsPattern = util.padZero( monthIndex );
            break;
          }
          case "MMM": {
            monthAsPattern = util.captializeFirstChar( monthArray[ monthIndex ].substr(0,3) );
            break;
          }
          case "MMMM": {
            monthAsPattern = util.captializeFirstChar( monthArray[ monthIndex ] );
            break;
          }
          case "mmm": {
            monthAsPattern = monthArray[ monthIndex ].substr(0,3);
            break;
          }
          case "mmmm": {
            monthAsPattern = monthArray[ monthIndex ];
            break;
          }
        }
      return monthAsPattern;
    }
    function formatDate( date, pattern ) {
      var dateAsPattern;
      switch( pattern || datePattern ) {
        case "D":
          dateAsPattern = date;
          break;
        case "DD":
          dateAsPattern = util.padZero( date );
          break;
      }
      return dateAsPattern;
    }
    function formatDay( dayIndex, pattern ) {
      var dayAsPattern;
      switch( pattern || dayPattern ) {
        case "d":
          dayAsPattern = util.padZero( dayIndex );
          break;
        case "dd":
          dayAsPattern = util.captializeFirstChar( dayArray[ dayIndex ].substr( 0, 2) );
          break;
        case "ddd":
          dayAsPattern = util.captializeFirstChar( dayArray[ dayIndex ].substr( 0, 3) );
          break;
        case "dddd":
          dayAsPattern = util.captializeFirstChar( dayArray[ dayIndex ] );
          break;
      }
      return dayAsPattern;
    }
    function normalizeMonth( m ) {
      var month = m;
      var regExp;
      if( _.isString( month ) === true ) {
        regExp = new RegExp( "^"+month , "i"  );
        month = _.find( monthArray, function( monthVal, monthIndex ) {
          return monthVal.match( regExp ) !== null;
        } );
      }
      return month;
    }
    function daysInMonth( forYear, forMonth ) {
        var febCount = forYear % 4 === 0 ? 29 : 28
        var days = [
                    31,
                    febCount,
                    31,
                    30,
                    31,
                    30,
                    31,
                    31,
                    30,
                    31,
                    30,
                    31
                  ];
        if( forMonth ) {
          return days[forMonth];
        }
        else {
          return days;
        }
    }
    function update() {
      koDate( momentObject );
      koToday( moment() );
      yearView();
      monthView();
      dateView();
      dayView();
    }
    function updateDate( d ) {
      var date = d;
      momentObject.set('date', date);
      update();
    }
    function updateMonth( m ) {
      var year = momentObject.year();
      var month = normalizeMonth( m );
      var date = momentObject.date();
      momentObject.set( 'year', year ).set( 'month', month ).set('date', date);
      update();
    }
    function updateYear( y ) {
      var year = y;
      var month = momentObject.month();
      var date = momentObject.date();
      momentObject.set( 'year', year ).set( 'month', month ).set('date', date);
      update();
    }
    function dayView() {
      // clear prior koMonthList
      koDayList([]);
      koDayList(
      /* begin: map */
      _.map( dayArray, function( dayVal, dayIndex ) {
        return formatDay( dayIndex )
      } )
      /* end: map */
      );
    }
    function yearView( y ) {
      var year;
      yearView.firstCall = _.isUndefined( yearView.firstCall ) === true ? true : false;
      if( yearView.firstCall === true ) {
        year = momentObject.year();
      }
      else {
        year = y;
      }
      if( _.isUndefined( year ) === true ) {
        return;
      }
      if( _.isString( year ) === true ) {
        yearView.cache = _.isUndefined( yearView.cache ) === true ? yearView() : yearView.cache;
        year = y === "n" ? yearView.cache[yearView.cache.length-1] + 2 : y === "p" ? yearView.cache[0] - 2 : "";
      }
      // clear prior koYearList
      koYearList([]);
      koYearList.push( year - 1 );
      koYearList.push(  year );
      koYearList.push( year + 1 );
      yearView.cache = koYearList();
    }
    function monthView( format ) {
      // clear prior koMonthList
      koMonthList([]);
      koMonthList(
      /* begin: map */
      _.map( monthArray, function( monthVal, monthIndex ) {
        return formatMonth( monthIndex , format )
      } )
      /* end: map */
      );
    }
    function dateView( forMonth, forYear, beginDayFrom, dayFormat ) {
      var forYear = forYear || momentObject.year();
      var forMonth = forMonth || momentObject.month();
      var forDate = momentObject.date();
      if( beginDayFrom ) {
        moveToFirst( self.dayArrayIndex, beginDayFrom );
      }
      if( dayFormat ) {
        dayPattern = dayFormat;
      }
      var monthBeginsOnDay = moment().set( 'month', forMonth ).set( 'date', 1 ).set( 'year', forYear).day();
      var monthsEndsOnDate = daysInMonth( forYear, forMonth );
      //console.log( "monthBeginsOnDay : " + monthBeginsOnDay );
      //console.log( "monthsEndsOnDate : " + monthsEndsOnDate );
      var weekList = [];
      // clear prior koDateList
      koDateList([]);
      for( var i=1; i< monthsEndsOnDate; i++ ) {
        /* begin outer loop */
        // clear weeklist for each loop
        weekList = [];
        for( var j=0;j<7;j++) {
        /* begin inner loop */
          if( i === 1 ){
            if( monthBeginsOnDay === dayArrayIndex[j] ) {
              weekList.push( formatDate( i ) );
              i = ( j !== 6 ) ? (i + 1) : i;
            }
            else {
              weekList.push( "" );
            }
          }
          else {
            weekList.push( formatDate( i ) );
            i = ( j !== 6 ) ? (i + 1) : i;
            if( i > monthsEndsOnDate ) {
              // following for loop needed to ensure consistency of array values
              for( var tempj = j+1; tempj<7; tempj++ ) {
                weekList.push( "" );
              }
              break;
            }
          }
        /* end inner loop */
        }
        koDateList.push( weekList );
      /* end outer loop */
      }
    }

    (function config( node, options ) {
      if( _.isUndefined( options ) === true ) {
        options = {};
      }
      if( node ) {
        var htmlText = $(node).html();
        $(node).empty().html( htmlText.replace( new RegExp( publishView, "g" ), publishViewForInstance ) );
      }
      var date = options.date;
      var month = options.month;
      var year = options.year;
      var beginDayFrom = options.beginDayFrom;
      if( _.isUndefined( options.dayFormat ) === false ) {
        dayPattern = options.dayFormat
      }
      if( _.isUndefined( options.yearFormat ) === false ) {
        yearPattern = options.yearFormat
      }
      if( _.isUndefined( options.monthFormat ) === false ) {
        monthPattern = options.monthFormat
      }
      if( _.isUndefined( options.dateFormat ) === false ) {
        datePattern = options.dateFormat
      }
      if ( year ) {
        momentObject.set( 'year', year );
      }
      if ( month ) {
        momentObject.set( 'month', month );
      }
      if ( date ) {
        momentObject.set( 'date', date );
      }
      koDayList( ( beginDayFrom ) ? util.moveToFirst( dayArrayIndex, beginDayFrom ) : dayArrayIndex );
      koDayList(
        _.map( koDayList(), function( index ) {
          return formatDay( index );
        })
      );
      update();
    })( options, node );
    self.closeView();
    return self;
  }
  
  return {
    init: init
  }
} );
