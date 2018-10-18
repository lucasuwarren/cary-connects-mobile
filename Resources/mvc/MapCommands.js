var parkingLots;
var places;

// Load the cached parking lots
function loadParkingLots() {
  // @todo check for a cached file

  // Use the app's included file
  var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,
    'assets/data/parking.geojson');
  var blob = file.read();
  var text = blob.text;
  blob = null;
  file = null;

  parkingLots = JSON.parse(text);
  Ti.App.fireEvent('UpdateParkingLots', parkingLots);
  exports.retrievePlaces(1);
}

exports.retrieveParkingLots = function (pass) {

  // Access the parking lots using HTTP client
  var url = "https://raw.githubusercontent.com/CodeForCary/cary-connects-data/master/parking.geojson";
  var client = Ti.Network.createHTTPClient({
    onload: function (e) {
      // @todo cache the file for later
      parkingLots = JSON.parse(this.responseText);
      Ti.App.fireEvent('UpdateParkingLots', parkingLots);
      exports.retrievePlaces(1);
    },
    onerror: function (e) {
      Ti.API.debug(e.error);
      // Try again
      if (pass <= 2) {
        setTimeout(function () {
          exports.retrieveParkingLots(pass + 1);
        }, 1000);
        return;
      }
      // Let the user choose to try again
      var dialog = Titanium.UI.createAlertDialog({
        title: 'A network issue occurred',
        message: "Try again?",
        buttonNames: ['Yes', 'No'],
        cancel: 1
      });
      dialog.addEventListener('click', function (de) {
        if (de.index === de.source.cancel) {
          loadParkingLots();
          return;
        }
        exports.retrieveParkingLots(pass + 1);
      });
      dialog.show();
    },
    timeout: 5000  // in milliseconds
  });
  client.open("GET", url);
  console.log("Opening connection to: " + url);
  client.send();

};

exports.retrievePlaces = function (pass) {

  // Access the places using HTTP client
  var url = "https://raw.githubusercontent.com/CodeForCary/cary-connects-data/master/business.geojson";
  var client = Ti.Network.createHTTPClient({
    onload: function (e) {
      // @todo write the file for later use
      places = JSON.parse(this.responseText);
      Ti.App.fireEvent('UpdatePlaces', places);
    },
    onerror: function (e) {
      Ti.API.debug(e.error);
      // Try again
      if (pass <= 2) {
        setTimeout(function () {
          exports.retrievePlaces(pass + 1);
        }, 1000);
        return;
      }
      // Let the user choose to try again
      var dialog = Titanium.UI.createAlertDialog({
        title: 'A network issue occurred',
        message: "Try again?",
        buttonNames: ['Yes', 'No'],
        cancel: 1
      });
      dialog.addEventListener('click', function (de) {
        if (de.index === de.source.cancel) {
          // @todo
          // loadPlaces();
          return;
        }
        exports.retrievePlaces(pass + 1);
      });
      dialog.show();
    },
    timeout: 5000  // in milliseconds
  });
  client.open("GET", url);
  console.log("Opening connection to: " + url);
  client.send();

};