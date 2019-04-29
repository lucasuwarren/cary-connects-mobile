var parkingLots = {};
var parkingLotsArray = [];
var places = {};
var placesArray = [];

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

  var json = JSON.parse(text);
  processParkingLotRecords(json);
  exports.retrievePlaces(1);
}

function processParkingLotRecords (json) {
  // New data set
  if (json !== undefined && json.features) {
    for (var i = 0; i < json.features.length; i++) {
      var record = json.features[i];
      var indexValue = 'index-' + i;
      var thisRecord = {
        index: i,
        itemId: indexValue,
        name: record['name']
      };
      parkingLots[indexValue] = thisRecord;
      parkingLotsArray.push(thisRecord);
    }
    Ti.App.fireEvent('UpdateParkingLots', json);
  }
}

exports.retrieveParkingLots = function (pass) {

  // Access the parking lots using HTTP client
  var url = "https://raw.githubusercontent.com/CodeForCary/cary-connects-data/master/parking.geojson";
  var client = Ti.Network.createHTTPClient({
    onload: function (e) {
      // @todo cache the file for later
      var json = JSON.parse(this.responseText);
      processParkingLotRecords(json);
      // Call the next data-set
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

// Load the cached parking lots
function loadPlaces() {
  // @todo check for a cached file
  // Use the app's included file
  var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,
    'assets/data/business.geojson');
  var blob = file.read();
  var text = blob.text;
  blob = null;
  file = null;

  var json = JSON.parse(text);
  processPlaceRecords(json);
}

function processPlaceRecords (json) {
  // New data set
  if (json !== undefined && json.features) {
    for (var i = 0; i < json.features.length; i++) {
      var record = json.features[i];
      var indexValue = 'index-' + i;
      var thisRecord = {
        index: i,
        itemId: indexValue,
        name: record.properties['name'],
        address: record.properties['address'],
        website: record.properties['website'],
        phone: record.properties['phone'],
        note: record.properties['note'],
        latitude: record.geometry.coordinates[1],
        longitude: record.geometry.coordinates[0]
      };
      places[indexValue] = thisRecord;
      placesArray.push(thisRecord);
    }
    Ti.App.fireEvent('UpdatePlaces', json);
  }
}

exports.retrievePlaces = function (pass) {

  // Access the places using HTTP client
  var url = "https://raw.githubusercontent.com/CodeForCary/cary-connects-data/master/business.geojson";
  var client = Ti.Network.createHTTPClient({
    onload: function (e) {
      // @todo write the file for later use
      var json = JSON.parse(this.responseText);
      processPlaceRecords(json);
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
          loadPlaces();
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

// Filter function
var filterProperty = function (place, searchText) {
  if (!place['name']) {
    return false;
  }
  if (place['name'].toLowerCase().includes(searchText.toLowerCase())) {
    return true;
  }
  // Check the filters
  // if (place['marker-symbol'].toLowerCase().includes(searchText.toLowerCase())) {
  //   return true;
  // }
  return false;
};

exports.searchPlaces = function (searchText, maxResults) {
  if (placesArray == null || placesArray.length === 0 || searchText === undefined || searchText.length === 0) {
    console.log("No records to search");
    return [];
  }
  // Filter the records
  var results = [];
  for (var i in placesArray) {
    var val = placesArray[i];
    if (filterProperty(val, searchText)) {
      results.push(val);
    }
  }
  // Sort the results
  results.sort(function (a, b) {

    var searchTerm = searchText.toLowerCase();
    var item1 = a.name.toLowerCase();
    var item2 = b.name.toLowerCase();

    // Show 'starts with' first
    if (item1.indexOf(searchTerm) === 0 &&
      item2.indexOf(searchTerm) !== 0) {
      return -1;
    }
    if (item1.indexOf(searchTerm) !== 0 &&
      item2.indexOf(searchTerm) === 0) {
      return 1;
    }
    // Then alphabetical
    if (item1 < item2) {
      return -1;
    }
    if (item1 > item2) {
      return 1;
    }
    return 0;
  });
  // Return the max size
  if (maxResults) {
    return results.slice(0, maxResults);
  }
  return results;
};

exports.parkingLots = parkingLots;
exports.parkingLotsArray = parkingLotsArray;
exports.places = places;
exports.placesArray = placesArray;
