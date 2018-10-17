/**
 * Cary Connects startup...
 */

// Create a single window app
var MapController = require('/mvc/MapController');
var mapWindow = MapController.createWindow({
  windowTitle: 'Cary Connects',
  title: 'Parking',
  fullscreen: false
});

if (Ti.UI.Android) {
  mapWindow.open();
}

if (Ti.UI.iOS) {
  // Wrap the window in a navigation window
  var mainWindow = Titanium.UI.iOS.createNavigationWindow({
    window: mapWindow
  });
  mapWindow.navigationWindow = mainWindow;
  mainWindow.open();
}
