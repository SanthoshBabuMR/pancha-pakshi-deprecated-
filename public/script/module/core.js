define( [ "underscore", "moment", "util", "text!sastram" ], function( _ , moment, util, db ) {

  var sastramDb = JSON.parse( db );
  /**
   * @function getDuration
   * @description convert time into duration; by default, returns duration in seconds
   * @param {momentObject} momentObject
   * @param {string} type Optional. specifies the duration type to return eg: asMinutes, asHours
   * @return {number}
   */
  function getDuration( momentObject, type ) {
    var as = ( type !== undefined ) ? type : "asSeconds";
    return moment.duration( momentObject )[as]();
  }
  /**
   * @function formatDuration
   * @description convert duration into time; only accepts duration as seconds
   * @param {number} durationInSeconds
   * @param {formatAs} Optional. specifies the format to return; eg: 02:05:03 pm or 14:05:03
   * @param {momentObject} Optional.
   * @return {string}
   */
  function formatDuration( durationInSeconds, formatAs, momentObject ) {
    var m = momentObject === undefined ? moment() : momentObject;
        d = {
          s: durationInSeconds || 0
        };
    return m.set('hour', getDuration( d, "hours" ) )
            .set('minute', getDuration( d, "minutes" ) )
            .set('second', getDuration( d, "seconds" ) )
            .format( formatAs || "HH:mm:ss" );
  }
  /**
   * @function getPaksham
   * @description get paksham for the given time object
   * @param {momentObject} the time object for which the paksham should be determined
   * @return {string}
   */
  function getPaksham( momentObject ) {
    return "shuklaPaksham";
  }
  /**
   * @function getSunrise
   * @description get sunrise time for the given time object
   * @param {momentObject} the time object for which the sunrise should be determined
   * @return {moment object}
   */
  function getSunrise( momentObject ) {
    var sunrise = "06:00:00".split(":"); //sunrise[ momentObject.format("DD:MM:YYYY") ].split(":")
    return moment( momentObject ).set( 'hour',sunrise [0] ).set( 'minute',sunrise [1] ).set( 'second',sunrise [2] )
  }
  /**
   * @function convertToSastramTime
   * @description convert given time into satram time
   *              i.e. sastram object will have 00:00:00 set to sunrise, 12:00:00 to sunset
   * @param {momentObject} the time object to be converted
   * @return {moment object}
   */
  function convertToSastramTime( momentObject ) {
    var m = momentObject === undefined ? moment() : momentObject;
    var sunrise = getSunrise( m ),
        dayBefore,
        dayBeforeSunrise,
        timeGap;

    if( moment( m ) .isBefore( sunrise ) ) {
      dayBefore = moment( m ).subtract( 1, 'day' );
      dayBeforeSunrise = getSunrise( dayBefore );
      timeGap = moment( dayBefore ).subtract( dayBeforeSunrise );
      m = dayBefore.set('hour', timeGap.hours() )
                   .set('minute', timeGap.minutes() )
                   .set('second', timeGap.seconds() );
    }
    else {
      timeGap = moment( m ).subtract( sunrise );
      m = m.set('hour', timeGap.hours() )
           .set('minute', timeGap.minutes() )
           .set('second', timeGap.seconds() );
    }
    return m;
  }
  /**
   * @function DurationPassedByInDay
   * @description return the time passed by for the given day since sunrise, in seconds
   * @param {momentObject} momentObjectAsPerSastram
   * @return {number}
   */
  function DurationPassedByInDay( momentObjectAsPerSastram ) {
    return getDuration( momentObjectAsPerSastram );
  }
  /**
   * @function DurationPassedByInJamam
   * @description return the time passed by for the given jamam since it started, in seconds
   * @param {momentObject} momentObjectAsPerSastram
   * @return {number}
   */
  function DurationPassedByInJamam( momentObjectAsPerSastram ) {
    return DurationPassedByInDay( momentObjectAsPerSastram ) % 8640
  }
  /**
   * @function getDayOrNight
   * @description return if the current time object falls in day or night as per sastram
   * @param {momentObject} momentObjectAsPerSastram
   * @return {string}
   */
  function getDayOrNight( momentObjectAsPerSastram ) {
    return DurationPassedByInDay( momentObjectAsPerSastram ) > 43199 ? "night" : "day";
  }
  /**
   * @function getJamam
   * @description get the jamam for the given time object
   * @param {momentObject} momentObjectAsPerSastram
   * @return {number}
   */
  function getJamam( momentObjectAsPerSastram ) {
    return window.parseInt( DurationPassedByInDay( momentObjectAsPerSastram ) / 8640 );
  }
  /**
   * @function getSastram
   * @description get the pakshi sastram for the given time object
   * @param {momentObject} momentObject
   * @return {object}
   */
  function getSastram( momentObject ) {
    // get momentobject() or default to current time
    var m = momentObject === undefined ? moment() : momentObject;
    var cycle = sastramDb.cycle,
        jamamDuration = 8640,
        // convert momentobject as sastram object
        momentObjectAsPerSastram = convertToSastramTime( moment( m ) ),
        // get paksham
        paksham = getPaksham( momentObjectAsPerSastram ),
        // get day or night
        dayOrNight = getDayOrNight( momentObjectAsPerSastram ),
        // get week
        week = momentObjectAsPerSastram.format("dddd").toLowerCase(),
        // get jamam
        jamam = getJamam( momentObjectAsPerSastram ),
        // get remaining jamam duration
        remainingDuration = jamamDuration - DurationPassedByInJamam( momentObjectAsPerSastram ),
        // get jamam start time
        startTime = moment( m ).subtract( jamamDuration - remainingDuration, 'seconds');
        // get jamam end time
        endTime = moment( startTime ).add( jamamDuration, 'seconds');


    if( jamam > 4 ) {
      jamam = jamam - 5;
    }

    var sastram = cycle[paksham][dayOrNight];
    var order = sastram.order;
    var birds = {};
    _.each( order, function( bird ) {
      birds[bird] = {};
      birds[bird]["sub"] = {};
      birds[bird].activity = sastram.activity[week][bird][jamam];
      birds[bird].friends = cycle[paksham].pakshi[bird].friend;
      birds[bird].foes = cycle[paksham].pakshi[bird].foe;
      birds[bird].birdStatus = (function() {
          if( _.contains( cycle[paksham].pakshi[bird].rulez[dayOrNight], week ) ) {
            return "rulez";
          }
          else if( _.contains( cycle[paksham].pakshi[bird].dies, week ) ) {
            return "dies";
          }
          return "normal";
        }());
      birds[bird]["sub"].activityOrder = util.moveToFirst( sastram.activity[week][bird] , sastram.activity[week][bird][jamam] );
      birds[bird]["sub"].pakshiOrder = util.moveToFirst( order , bird );
      birds[bird]["sub"].activityDuration = _.map( birds[bird]["sub"].activityOrder, function( activityType ) {
            return sastram.duration.sub[activityType]
      } );
    } );
    return {
      birds: birds,
      startTime: startTime,
      endTime: endTime
    };
  }

  return {
    pakshiSastram: getSastram,
    formatDuration: formatDuration,
    getDuration: getDuration
  };
})
