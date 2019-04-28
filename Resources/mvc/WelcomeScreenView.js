// Welcome screen view
// Throw it on top of MapView
exports.createWelcomeScreenView = function (win) {
  var textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
  var clientHeight = Ti.Platform.displayCaps.platformHeight;
  var clientWidth = Ti.Platform.displayCaps.platformWidth;
  if (Ti.UI.Android) {
    clientHeight = Ti.Platform.displayCaps.platformHeight / (Ti.Platform.displayCaps.dpi / 160);
  }

  var infoButton = Ti.UI.createButton({
    title: 'About'
  });
  infoButton.addEventListener('click', function () {
    Ti.App.fireEvent('ShowWelcomeScreen');
  });

  var welcomeScreenView = Ti.UI.createView({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#a051be',
    zIndex: 1,
    layout: 'vertical',
    visible: false
  });
  if (!Ti.App.Properties.hasProperty('welcome.shown')) {
    welcomeScreenView.visible = true;
  } else {
    win.leftNavButton = infoButton;
  }
  var caryConnectsLogo = Ti.UI.createImageView({
    top: '1%',
    image: '/assets/icons/DefaultIcon_white_inside.png',
    width: 340 + 'dp',
    height: 190 + 'dp'
  });

  welcomeScreenView.add(caryConnectsLogo);

  var welcomeScreenLabel = Ti.UI.createLabel({
    top: '5%',
    width: '80%',
    height: 'auto',
    color: '#ffffff',
    textAlign: 'center',
    text: 'Welcome to the Cary Connects Mobile App!\nWe are a community of civic hackers working together to share information about Cary, North Carolina.\n\nThis app aims to help you search for places and find parking for your next visit.',
    verticalAlign: 1
  });
  welcomeScreenView.add(welcomeScreenLabel);

  var continueButton = Ti.UI.createButton({
    textAlign: textAlign,
    top: "5%",
    height: '35dp',
    width: '140dp',
    title: 'Continue',
    fontWeight: 'bold',
    borderRadius: '10dp',
    borderColor: '#ffffff',
    color: '#ffffff',
    backgroundColor: '#a051be'
  });
  welcomeScreenView.add(continueButton);

  var disclaimerLabel = Ti.UI.createLabel({
    top: '5%',
    width: '80%',
    height: 'auto',
    color: '#ffffff',
    font: {},
    textAlign: 'center',
    text: 'Disclaimer: Park at your own risk, please observe parking restrictions noted',
    verticalAlign: 1
  });
  welcomeScreenView.add(disclaimerLabel);

  continueButton.addEventListener('touchstart', function () {
    continueButton.backgroundColor = '#ffffff';
    continueButton.color = '#a051be';
  });
  continueButton.addEventListener('endstart', function () {
    continueButton.backgroundColor = '#a051be';
    continueButton.color = '#ffffff';
  });


  continueButton.addEventListener('click', function () {
    Ti.App.fireEvent('CloseWelcomeScreen');
  });

  Ti.App.addEventListener('CloseWelcomeScreen', function () {
    welcomeScreenView.animate({
      opacity: 0,
      duration: 200
    }, function () {
      welcomeScreenView.visible = false;
      win.leftNavButton = infoButton;
    });
    Ti.App.Properties.setBool('welcome.shown', true);
  });

  Ti.App.addEventListener('ShowWelcomeScreen', function () {
    win.leftNavButton = null;
    welcomeScreenView.visible = true;
    welcomeScreenView.animate({
      opacity: 1,
      duration: 200
    });
  });
  win.add(welcomeScreenView);
  return welcomeScreenView;
};
