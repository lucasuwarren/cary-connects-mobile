// This view holds all the search help and results information

var record = {};

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

  placeCardView.addEventListener('touchmove', function (e) {
    var points = e.source.convertPointToView({
      x: e.x,
      y: e.y
    }, win);

    var top = points.y;
    if (Ti.UI.Android) {
      top = top / (Ti.Platform.displayCaps.dpi / 160);
      console.log("ch: " + clientHeight + " y:" + top + " diff:" + (clientHeight - top));
    }

    // Upper max (1/2 screen)
    if (top < clientHeight / 2) {
      console.log("At max");
      return;
    }
    // Lower max
    if ((clientHeight - top) < 144) {
      console.log("At min");
      return;
    }
    console.log("Updating to : " + top);

    placeCardView.applyProperties({
      top: top + 'dp'
    });
  });


  var handleView = Ti.UI.createView({
    top: '8dp',
    width: '35dp',
    height: '6dp',
    borderRadius: '2dp',
    backgroundColor: '#0090BB'
  });
  placeCardView.add(handleView);

  // Place Details
  var scrollView = Ti.UI.createScrollView({
    top: 18 + 'dp',
    left: 0,
    right: 0,
    height: clientHeight + 'dp',
    scrollingEnabled: false,
    showVerticalScrollIndicator: false,
    showHorizontalScrollIndicator: false,
    layout: 'vertical'
  });
  placeCardView.add(scrollView);

  var titleLabel = Ti.UI.createLabel({
    top: '0dp',
    left: '20dp',
    right: '20dp',
    color: '#ffffff',
    text: 'Name of place',
    font: {
      fontSize: '24dp'
    }
  });
  scrollView.add(titleLabel);

  var addressLabel = Ti.UI.createLabel({
    top: '0dp',
    left: '20dp',
    right: '20dp',
    color: '#ffffff',
    text: 'Address'
  });
  scrollView.add(addressLabel);

  var buttonView = Ti.UI.createView({
    top: '20dp',
    left: '20dp',
    right: '20dp',
    height: '48dp'
  });
  scrollView.add(buttonView);

  var findParkingButton = Ti.UI.createButton({
    title: 'Find Parking',
    top: 0,
    left: 0,
    width: '48%',
    height: '100%',
    color: '#ffffff',
    borderRadius: '10dp',
    backgroundColor: '#0090BB'
  });
  buttonView.add(findParkingButton);

  findParkingButton.addEventListener('click', function () {
    alert('find parking?');
  });

  var directionsButton = Ti.UI.createButton({
    title: 'Get Directions',
    top: 0,
    right: 0,
    width: '48%',
    height: '100%',
    color: '#ffffff',
    borderRadius: '10dp',
    backgroundColor: '#0090BB'
  });
  buttonView.add(directionsButton);

  directionsButton.addEventListener('click', function () {
    if (Ti.UI.Android) {
      Ti.Platform.openURL("http://maps.google.com/?daddr=" + record.latitude + "," + record.longitude);
    } else {
      Ti.Platform.openURL("maps://?daddr=" + record.latitude + "," + record.longitude);
    }
  });

  var websiteLabel = Ti.UI.createLabel({
    top: '10dp',
    left: '20dp',
    right: '20dp',
    color: '#ffffff',
    text: ''
  });
  scrollView.add(websiteLabel);

  websiteLabel.addEventListener('click', function () {
    var url = record.website;
    if (!url || url.length < 2) {
      return;
    }
    if (url.indexOf("http://") === -1 && url.indexOf("https://") === -1) {
      url = "http://" + url;
    }
    Ti.Platform.openURL(url);
  });

  var phoneLabel = Ti.UI.createLabel({
    top: '10dp',
    left: '20dp',
    right: '20dp',
    color: '#ffffff',
    text: ''
  });
  scrollView.add(phoneLabel);

  phoneLabel.addEventListener('click', function () {
    var phone = record.phone;
    if (!phone) {
      return;
    }
    phone = phone.replace(/\D+/g, '');

    if (Ti.Platform.model === 'Simulator') {
      alert('tel://' + phone);
    } else {
      Ti.Platform.openURL("tel://" + phone);
    }
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
    Ti.App.fireEvent('HidePlaceCard');
  });
  placeCardView.add(closeButton);
  win.add(placeCardView);

  // Add Global Event Listeners
  Ti.App.addEventListener('ShowPlaceCard', function (ev) {

    // Populate the card with the data
    record = ev.record;
    titleLabel.text = record.name;
    addressLabel.text = record.address;
    websiteLabel.text = record.website;
    phoneLabel.text = record.phone;

    // Bring it into view
    placeCardView.animate({
      top: (clientHeight / 2) + 'dp',
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
      top: clientHeight + 'dp',
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
