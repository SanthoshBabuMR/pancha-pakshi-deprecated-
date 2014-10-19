require( [ "core", "jquery", "moment", "disp", "knockout", "calender", "util", "time", "underscore" ], function( core, $, moment, disp, ko, calender, util, timeObj, _ ) {

  var koObj = {};
  view("owl");

  function view( p ) {
    var temp,
      instant,
      subInstant,
      bird;
      //koObj = {};
      koObj.list = [];
      var tempSubActivity = [];
      var tempKoObjLength;
    for( var i=0,j=0;j<11;j++) {
      tempKoObjLength = koObj.list.length || 0;
      instant = moment( ).set("hour", 0 ).set("minute", 0 ).set("second", i );
      subInstant = null;
      if( j === 0 ) {
        koObj.title = p.toUpperCase() + " " + instant.format("DD:MM:YYYY dddd");
        //console.log( p.toUpperCase() + " " + instant.format("DD:MM:YYYY dddd")  );
        //console.log("");
      }
      sastram = core.pakshiSastram( instant );
      bird = sastram.birds[p];
      //console.log( sastram )
      //console.log( core.formatDuration(i, "hh:mm a") + " " + disp.activity[ bird.activity ] );
      koObj.list[ tempKoObjLength ] = {}
      koObj.list[ tempKoObjLength ].mainActivity = core.formatDuration(i, "hh:mm a") + " " + disp.activity[ bird.activity ];
      i = core.getDuration( sastram.endTime );
      tempSubActivity = [];
      _.each( bird.sub.activityDuration, function( duration, index ) {
        subInstant = moment( _.isObject( subInstant) ? subInstant : sastram.startTime ).add( duration, 'seconds' );
        //console.log( "- " + subInstant.format("hh:mm a") + " " + bird.sub.activityOrder[index] + " " + bird.sub.pakshiOrder[index] );

        //console.log( moment().format("dddd hh:mm:ss a") + " isBefore " + subInstant.format("dddd hh:mm:ss a") )

        //console.log( moment().isBefore( subInstant ) );

        tempSubActivity.push( "- " + subInstant.format("hh:mm a") + " " + bird.sub.activityOrder[index] + " " + bird.sub.pakshiOrder[index] )
      } );
      koObj.list[ tempKoObjLength ].subActivity = tempSubActivity
      if( j > 15) {
       console.error("force break");
       break;
      }
      //console.log("");
    }
    //console.log( koObj)

  }

  // uncommet below line to applybinding and comment the hide() statement
  //var timeObj1 = _.clone( timeObj.init(), true )
  timeObj1 = timeObj.init( $(".time-picker")[0], { timeObj: moment().set( 'hour', 18 ) } );
  ko.applyBindings( timeObj1 , $(".time-picker")[0] );
  $( $(".time-picker")[0] ).removeClass( "hide" );
  /*$( $(".time-picker")[0] ).remove();*/


  //var timeObj2 = _.clone( timeObj.init(), true )
  timeObj2 = timeObj.init( $(".time-picker")[1], { timeObj: moment().set( 'hour', 5 ) } );
  ko.applyBindings( timeObj2 , $(".time-picker")[1] );
  $( $(".time-picker")[1] ).removeClass( "hide" );

  //console.log( timeObj.init() === _.clone( timeObj.init(), true ) )
  // uncommet below line to applybinding and comment the hide() statement
  /*ko.applyBindings( koObj, $(".view1")[0] );*/ $( $(".view1")[0] ).remove();

  function calView() {
    var calenderObj1 = calender.init(
    $(".calender-picker")[0],
    {
      dayFormat: "dd"
    });
    var calenderObj2 = calender.init(
    $(".calender-picker")[1],
    {
      year: 1988,
      month: 7,
      date: 10
    });
    //console.log( calenderObj )
    // uncommet below line to applybindingand comment the hide() statement
    ko.applyBindings( calenderObj1, $(".calender-picker")[0] ); /*$( $(".calender")[0] ).remove();*/
    $( $(".calender-picker")[0] ).removeClass( "hide" );

    ko.applyBindings( calenderObj2, $(".calender-picker")[1] ); /*$( $(".calender")[0] ).remove();*/
    $( $(".calender-picker")[1] ).removeClass( "hide" );
  }
  calView();
})
