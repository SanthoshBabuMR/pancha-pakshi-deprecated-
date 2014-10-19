define( [ ], function() {

  var disp = {};
  disp.activity = {
      "r": "Ruling",
      "e": "Eating",
      "w": "Walking",
      "s": "Sleeping",
      "d": "Death"
  };
  disp.activityOrder =  [ "r", "e", "w", "s", "d" ];
  disp.delimiter = {
    time: ":",
    range: " - "
  };

  return disp;

} );
