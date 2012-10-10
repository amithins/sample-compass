//NOTE: Add button to make things start going.
// ClearWatch button would stop the watch
var watchID = null;
document.addEventListener("deviceready", onDeviceReady, false);

function writeNotification(value) {
    var notificationBox = document.getElementById("notificationBox");
    notificationBox.innerHTML = value;
}

function clearCurrentNotification() {
    var notificationBox = document.getElementById("notificationBox");
    notificationBox.innerHTML = "";
}           

function onDeviceReady() {
    document.getElementById("watchButton").addEventListener("click", handleWatch, false);
    document.getElementById("refreshButton").addEventListener("click", handleRefresh, false);
}

function handleRefresh() {
    navigator.compass.getCurrentHeading(onCompassWatchSuccess, onCompassWatchError);
}

function handleWatch() {
    // If watch is running, clear it now. Otherwise, start it.
    var button = document.getElementById("watchButton");
     
    if (watchID != null) {
        clearCurrentNotification();
        navigator.compass.clearWatch(watchID);
        watchID = null;
         
        button.innerHTML = "Start Compass Watch";
    }
    else {
        clearCurrentNotification();
        writeNotification("Waiting for compass information...");
        
        // Update the watch every second. Trigger a watchHeading
        // callback if the bearing changes by 10 degrees (not valid on Android).
        var options = { frequency: 1000, filter: 10 };
        watchID = navigator.compass.watchHeading(onCompassWatchSuccess, onCompassWatchError, options);
        
        button.innerHTML = "Clear Compass Watch";
    }
}

function onCompassWatchSuccess(heading) {
    // Successfully retrieved the compass information. Display it all.
    // True heading and accuracy are not meaningful on iOS and Android devices.
    var magneticHeading = heading.magneticHeading,
        timestamp = heading.magneticHeading;
    
    var informationMessage = 'Magnetic heading: ' + magneticHeading + '<br />' +
                             'Timestamp: ' + timestamp + '<br />' 
    clearCurrentNotification();
    writeNotification(informationMessage);
}

function onCompassWatchError(error) {
    var errorMessage = "code: " + error.code + "<br/>" +
                       "message: " + error.message + "<br/>";
    
    alert(errorMessage);
}