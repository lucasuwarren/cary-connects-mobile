// This view holds all the search help and results information

exports.createPlaceCardView = function (win) {
  var clientHeight = Ti.Platform.displayCaps.platformHeight;
  if (Ti.UI.Android) {
    clientHeight = Ti.Platform.displayCaps.platformHeight / (Ti.Platform.displayCaps.dpi / 160);
  }
  // Start the view offscreen
  var placeCardView = Ti.UI.createView({
    top: clientHeight + 'dp',
    bottom: -clientHeight - 20 + 'dp',
    left: 0,
    right: 0,
    opacity: 0,
    borderRadius: 15 + 'dp',
    backgroundColor: '#6FBE51'
  });

  // Place Details

  var titleLabel = Ti.UI.createLabel({
    top: '20dp',
    left: '20dp',
    right: 0,
    color: '#ffffff',
    text: 'Name of business'
  });
  placeCardView.add(titleLabel);





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
    // @todo determine what the close button does
    Ti.App.fireEvent('HidePlaceCard');
  });
  placeCardView.add(closeButton);
  win.add(placeCardView);

  // Add Global Event Listeners
  Ti.App.addEventListener('ShowPlaceCard', function (ev) {

    // Populate the card with the data
    var record = ev.record;
    titleLabel.text =
      record.name + '\n' +
      record.address;

    // Bring it into view
    placeCardView.animate({
      top: '75%',
      bottom: -20 + 'dp',
      opacity: 1,
      curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
      duration: 500
    }, function () {
      // console.log('ShowPlaceCard animate finished');
    });
  });

  Ti.App.addEventListener('HidePlaceCard', function () {
    placeCardView.animate({
      top: '100%',
      bottom: -clientHeight - 20 + 'dp',
      opacity: 0,
      curve: Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT,
      duration: 500
    }, function () {
      // console.log('HidePlaceCard animate finished');
    });
  });

  return placeCardView;
};
