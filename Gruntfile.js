module.exports = function( grunt ) {

	// grunt config
	grunt.initConfig({
		connect: {
			appServer: {
				// server begin
				options: {
					hostname: "localhost",
					port: 6234,
					keepalive: true
				}
				// server begin
			}
		}
	});

	// load task(s)
	grunt.loadNpmTasks( "grunt-contrib-connect" );

	// register task(s)
	grunt.registerTask( "appServer", "connect:appServer" );

};
