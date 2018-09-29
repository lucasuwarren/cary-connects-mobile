/**
 * Create a new `Ti.UI.TabGroup`.
 */
var tabGroup = Ti.UI.createTabGroup();

/**
 * Create the main tabs
 */
var MapController = require('/mvc/MapController');
tabGroup.addTab(MapController.createTab({
    windowTitle: 'Cary Connects',
    title: 'Parking',
    icon: 'assets/icons/815-car.png',
    activeIcon: 'assets/icons/815-car-selected.png'
}));

/**
 * Open the tabGroup
 */
tabGroup.open();
