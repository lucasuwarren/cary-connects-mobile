// var parkingLots = {};
// var businesses = {};

exports.createTab = function (args) {

  var win = this.createWindow(args);

  var tabArgs = {
    title: args.title,
    window: win
  };
  if (Ti.UI.iOS) {
    tabArgs.icon = args.icon;
    tabArgs.activeIcon = args.activeIcon;
  }
  var tab = Ti.UI.createTab(tabArgs);
  win.tab = tab;

  return tab;
};

exports.createWindow = function (args) {

  // Create the window to to attach UI components to
  var win = Ti.UI.createWindow({
    title: args.windowTitle,
    backgroundColor: '#ffffff',
    barColor: '#6FBE51',
    navTintColor: '#ffffff',
    titleAttributes: {
      color: '#0090BB'
    }
  });

  // Create the UI
  var Map = require('ti.map');
  var MapView = require('/mvc/MapView');
  var MapSearchView = require('/mvc/MapSearchView');
  var MapSearchHelpView = require('/mvc/MapSearchHelpView');
  var MapSearchResultsView = require('/mvc/MapSearchResultsView');
  var MapPlaceCardView = require('/mvc/MapPlaceCardView');

  // The Map
  var mapView = MapView.createMapView(win);

  // The Map Search and Results
  var searchField = MapSearchView.createSearchField(win);
  var searchHelpView = MapSearchHelpView.createSearchHelpView(win);
  var listView = MapSearchResultsView.createListView(win, searchHelpView);

  // The PlaceCardView
  var placeCardView = MapPlaceCardView.createPlaceCardView(win);

  // Wait for the app window to open
  win.addEventListener('open', function () {
    var MapCommands = require('/mvc/MapCommands');
    MapCommands.retrieveParkingLots(1);
  });

  return win;
};