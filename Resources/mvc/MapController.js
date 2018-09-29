exports.createTab = function (args) {

    /**
     * Create the window
     */
    var win = Ti.UI.createWindow({
        title: args.windowTitle,
        backgroundColor: '#ffffff',
        barColor: '#6FBE51',
        navTintColor: '#ffffff',
        titleAttributes: {
            color: '#0090BB'
        }
    });

    /**
     * Create the UI
     */
    var MapView = require('/mvc/MapView');
    MapView.createView(win);

    /**
     * Create the tab
     */
    var tab = Ti.UI.createTab({
        title: args.title,
        icon: args.icon,
        activeIcon: args.activeIcon,
        window: win
    });
    win.tab = tab;

    return tab;
};