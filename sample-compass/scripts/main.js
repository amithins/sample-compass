document.addEventListener("deviceready", onDeviceReady, false);

var compassHelpter;

function onDeviceReady() {
	compassHelpter = new CompassHelper();
	compassHelpter.run();
}

function CompassHelper() {
}

CompassHelper.prototype = {
	watchID : null,
	run: function() {
		var refreshButton = document.getElementById("refreshButton"),
		buttonWatch = document.getElementById("watchButton"),
		that = this,
		platform = device.platform;
        
		if (platform === 'Android') {
			buttonWatch.style.display = "none";
			refreshButton.style.width = "300px";
			
		}
		else {
			buttonWatch.addEventListener("click", 
										 function() {
											 that.handleWatch.apply(that, arguments);
										 }, 
										 false);
		}
		
		refreshButton.addEventListener("click", 
									   function() {
										   that.handleRefresh.apply(that, arguments)
									   }, 
									   false);
	},
    
	handleRefresh: function() {
		var that = this;
		navigator.compass.getCurrentHeading(function() { 
			that.onCompassWatchSuccess.apply(that, arguments)
		},
        function() {
        	that.onCompassWatchError.apply(that, arguments)
        });
	},
    
	handleWatch: function() {
		var button = document.getElementById("watchButton"),
		that = this;

		if (that.watchID !== null) {
			navigator.compass.clearWatch(that.watchID);
			that.watchID = null;
			button.innerHTML = "Start Compass";
			that.clearCurrentNotification();
		}
		else {
			that.clearCurrentNotification();
			that.writeNotification("Waiting for compass information...");
			var options = { frequency: 1000, filter: 10 };
			that.watchID = navigator.compass.watchHeading(function() { 
				button.innerHTML = "Stop Compass";
				that.onCompassWatchSuccess.apply(that, arguments)
			}, 
            function() {
              that.onCompassWatchError.apply(that, arguments)
            }, 
            options);
		}
	},
    
	onCompassWatchSuccess: function(heading) {
		var that = this;
		var magneticHeading = heading.magneticHeading,
		timestamp = heading.magneticHeading;
        
		var informationMessage = 'Magnetic field: ' + magneticHeading + '<br />' +
								 'Timestamp: ' + timestamp + '<br />' 
        
		document.getElementById("compass").style.MozTransform = "rotate(" + magneticHeading + "deg)";                      
		document.getElementById("compass").style.webkitTransform = "rotate(" + magneticHeading + "deg)";
        
		that.clearCurrentNotification();
		that.writeNotification(informationMessage);
	},
    
	onCompassWatchError: function(error) {
		var errorMessage,
		that = this;
        
		if (error.code === CompassError.COMPASS_NOT_SUPPORTED) {
			errorMessage = "Compass not suppoerted";
		}
		else if (error.code === CompassError.COMPASS_INTERNAL_ERR) {
			errorMessage = "Compass internal error";
		}
        
		that.watchID = null;
		that.clearCurrentNotification();
		that.writeNotification(errorMessage);
	},
    
	writeNotification: function(text) {
		var result = document.getElementById("result");
		result.innerHTML = text;
	},
    
	clearCurrentNotification: function() {
		var result = document.getElementById("result");
		result.innerText = "";
	}
}