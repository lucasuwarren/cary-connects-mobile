// This view holds all the search help and results information

exports.createSearchHelpView = function (win) {
  var clientHeight = Ti.Platform.displayCaps.platformHeight;
  if (Ti.UI.Android) {
    clientHeight = Ti.Platform.displayCaps.platformHeight / (Ti.Platform.displayCaps.dpi / 160);
  }
  // Start the view offscreen
  var searchHelpView = Ti.UI.createView({
    top: clientHeight + 'dp',
    bottom: -clientHeight - 20 + 'dp',
    left: 0,
    right: 0,
    opacity: 0,
    borderRadius: 15 + 'dp',
    backgroundColor: '#0090BB'
  });
  var closeButton = Ti.UI.createButton({
    top: '10dp',
    right: '10dp',
    height: '20dp',
    width: '20dp',
    title: 'X',
    borderRadius: '10dp',
    color: 'black',
    backgroundColor: 'white'
  });
  closeButton.addEventListener('click', function () {
    Ti.App.fireEvent('HideSearch');
  });
  searchHelpView.add(closeButton);
  win.add(searchHelpView);

  // Add Global Event Listeners
  Ti.App.addEventListener('ShowSearch', function () {
    searchHelpView.animate({
      top: 65 + 'dp',
      bottom: -20 + 'dp',
      opacity: 1,
      curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
      duration: 500
    }, function () {
      // console.log('ShowSearch animate finished');
    });
  });

  Ti.App.addEventListener('HideSearch', function () {
    searchHelpView.animate({
      top: clientHeight + 'dp',
      bottom: -clientHeight - 20 + 'dp',
      opacity: 0,
      curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
      duration: 500
    }, function () {
      // console.log('HideSearch animate finished');
    });
  });

  return searchHelpView;
};
