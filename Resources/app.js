/**
 * Cary Connects startup...
 */

// Create a single window app
var MapController = require('/mvc/MapController');
var win = MapController.createWindow({
  windowTitle: 'Cary Connects',
  title: 'Parking',
  fullscreen: false
});

if (Ti.UI.Android) {
  var actionBar;
  win.addEventListener("open", function () {
    if (!win.activity) {
      Ti.API.error("Can't access action bar on a lightweight window.");
    } else {
      actionBar = win.activity.actionBar;
      if (actionBar) {
        actionBar.backgroundImage = '/assets/images/window-title-background.png';
        actionBar.title = "Cary Connects";
        actionBar.onHomeIconItemSelected = function () {
          Ti.API.info("Home icon clicked!");
        };
      }
    }
  });
  win.open();
}

if (Ti.UI.iOS) {
  // Wrap the window in a navigation window
  var mainWindow = Titanium.UI.iOS.createNavigationWindow({
    window: win
  });
  win.navigationWindow = mainWindow;
  mainWindow.open();
}
