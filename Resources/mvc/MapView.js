exports.createMapView = function (win) {

  // Create the map
  var Map = require('ti.map');
  var mapView = Map.createView({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    mapType: Map.NORMAL_TYPE,
    region: {
      latitude: 35.789474,
      longitude: -78.781173,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05
    },
    showPointsOfInterest: true,
    showsTraffic: true,
    animate: true,
    regionFit: true,
    userLocation: true,
    annotations: []
  });
  win.add(mapView);

  return mapView;
};

exports.createSearchField = function (win, mapView) {

  // Place a view behind the search field to hold other buttons, etc.
  var searchView = Ti.UI.createView({
    top: 10 + 'dp',
    left: 10 + 'dp',
    right: 10 + 'dp',
    height: 45 + 'dp',
    borderWidth: 1 + 'dp',
    borderColor: '#999999',
    backgroundColor: '#ffffff'
  });

  // Create the search field
  var searchField = Ti.UI.createTextField({
    autocorrect: false,
    hintText: 'Search Cary',
    left: 42 + 'dp',
    right: 10 + 'dp',
    height: Ti.UI.SIZE,
    // suppressReturn: false,
    autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS,
    clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
    // returnKeyType: Ti.UI.RETURNKEY_NEXT,
    // keyboardType: Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION,
    color: '#333333',
    hintTextColor: '#999999',
    backgroundColor: '#ffffff'
  });
  searchView.add(searchField);

  searchField.addEventListener('return', function () {
    searchField.blur();
  });

  var searchImage = Ti.UI.createImageView({
    image: '/assets/icons/06-magnify.png',
    preventDefaultImage: true,
    left: 15 + 'dp',
    width: 20 + 'dp',
    height: 20 + 'dp',
    tintColor: '#999999'
  });
  searchView.add(searchImage);

  win.add(searchView);
  return searchField;
};

exports.createListView = function (win, mapView) {

};