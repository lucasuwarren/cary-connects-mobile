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

  Ti.App.fireEvent('UpdateParkingLots', text);
}

exports.retrieveParkingLots = function () {

  // Access the parking lots using HTTP client
  var url = "http://codeforcary.org/parking/parking.geojson";
  var client = Ti.Network.createHTTPClient({
    onload: function (e) {
      // @todo cache the file for later

      var jsonResponse = {data: this.responseText};
      Ti.App.fireEvent('UpdateParkingLots', jsonResponse);
    },
    onerror: function (e) {
      Ti.API.debug(e.error);
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
        retrieveParkingLots();
      });
      dialog.show();
    },
    timeout: 5000  // in milliseconds
  });
  client.open("GET", url);
  console.log("Opening connection to: " + url);
  client.send();

};