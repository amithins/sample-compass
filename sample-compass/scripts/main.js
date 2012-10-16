document.addEventListener("deviceready", onDeviceReady, false);
var compassHelpter;

function onDeviceReady() {
    compassHelpter = new CompassHelper();
}

function CompassHelper() {
    var that = this;
    that.init();
}

CompassHelper.prototype = {
    watchID : null,
    init: function() {
		var that = this;
          
        var platform = device.platform;
        if(platform === 'Android') {
            var buttonWatch = document.getElementById("watchButton");
            buttonWatch.style.display = 'none';
            document.getElementById("watchButton").addEventListener("click", 
																function() {
                                                                    that.handleWatch.apply(that, arguments);
																}, 
																false);
        }
		document.getElementById("refreshButton").addEventListener("click", 
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
         
        if (that.watchID != null) {
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
                                                            that.onCompassWatchSuccess.apply(that, arguments)
                                                        }, 
                                                        function() {
                                                            that.onCompassWatchError.apply(that, arguments)
                                                        }, 
                                                        options);
            
            button.innerHTML = "Stop Compass";
        }
    },
    
    onCompassWatchSuccess: function(heading) {
        var that = this;
        var magneticHeading = heading.magneticHeading,
            timestamp = heading.magneticHeading;
        
        var informationMessage = 'Magnetic heading: ' + magneticHeading + '<br />' +
                                 'Timestamp: ' + timestamp + '<br />' 
        document.getElementById("compass").style.MozTransform = "rotate(" + magneticHeading + "deg)";                      
        document.getElementById("compass").style.webkitTransform = "rotate(" + magneticHeading + "deg)";
        
        that.clearCurrentNotification();
        that.writeNotification(informationMessage);
    },
    
    onCompassWatchError: function(error) {
        var errorMessage = "code: " + error.code + "<br/>" +
                           "message: " + error.message + "<br/>";
        alert(errorMessage);
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