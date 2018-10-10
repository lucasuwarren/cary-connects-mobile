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
  var mapView = MapView.createMapView(win);
  var searchField = MapView.createSearchField(win, mapView);
  // var listView = MapView.createListView(win, mapView);

  /**
   * Event handlers
   */

  // Wait for the app window to open
  win.addEventListener('open', function () {
    var MapCommands = require('/mvc/MapCommands');
    MapCommands.retrieveParkingLots();
  });

  Ti.App.addEventListener('UpdateParkingLots', function (ev) {
    // Updates the parking lots on the map
    var json = JSON.parse(ev.data);
    console.log(JSON.stringify(json));
    if (json !== undefined && json.features) {
      console.log("Found features...");
      var polygonData = [];
      for (var i = 0; i < json.features.length; i++) {
        console.log("Feature " + i);
        var record = json.features[i];
        if (record.geometry && record.geometry.coordinates) {
          var coordinates = record.geometry.coordinates[0];
          var points = [];
          for (var j = 0; j < coordinates.length; j++) {
            console.log("Coordinate: " + j);
            var point = {
              latitude: coordinates[j][1],
              longitude: coordinates[j][0]
            };
            points.push(point);
          }
          var polygon = Map.createPolygon({
            points: points,
            strokeColor: 'red',
            fillColor: 'blue',
            strokeWidth: 1
          });
          if (Ti.UI.Android) {
            mapView.addPolygon(polygon);
          } else {
            polygonData.push(polygon);
          }
        }
      }
      if (!Ti.UI.Android) {
        mapView.addPolygons(polygonData);
      }
    }
  });

  return win;
};