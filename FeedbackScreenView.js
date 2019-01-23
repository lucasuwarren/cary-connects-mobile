// Feedback screen view
// Throw it on top of MapView
exports.createfeedbackScreenView = function (win) {
  var textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
  var clientHeight = Ti.Platform.displayCaps.platformHeight;
  var clientWidth = Ti.Platform.displayCaps.platformWidth;
  if (Ti.UI.Android) {
    clientHeight = Ti.Platform.displayCaps.platformHeight / (Ti.Platform.displayCaps.dpi / 160);
  }

  var infoButton = Ti.UI.createButton({
    title: 'Comments'
  });
  infoButton.addEventListener('click', function(){
    Ti.App.fireEvent('ShowFeedbackScreen');
  });

  var feedbackScreenView = Ti.UI.createView({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#a051be',
    zIndex: 1,
    layout: 'vertical',
    visible: false
  });
  if (!Ti.App.Properties.hasProperty('feedback.shown')) {
    feedbackScreenView.visible = true;
  } else {
    win.leftNavButton = infoButton;
  }
  var caryConnectsLogo = Ti.UI.createImageView({
    image: '/assets/icons/DefaultIcon_white_inside.png',
    width: '80%',
    height: 220
  });

  feedbackScreenView.add(caryConnectsLogo);

  var feedbackScreenLabel = Ti.UI.createLabel({
    top: '5%',
    width: '80%',
    height: 'auto',
    color: '#ffffff',
    font: {
    },
    textAlign: 'center',
    text: 'Welcome to the Cary Connects Mobile App! \n Please let us know what you think about the app.',
    verticalAlign: 1
  });


  feedbackScreenView.add(feedbackScreenLabel);

  var feedbackScreenTextbox = Ti.UI.createTextarea({
    width: '80%',
    top: '15%',
    height: 'auto',
    color:  '#ffffff',
    verticalAlign:  1

  });
  feedbackScreenView.add(feedbackScreenTextbox);

  var continueButton = Ti.UI.createButton({
    textAlign: textAlign,
    verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM,
    top: "5%",
    height: '35dp',
    width: '140dp',
    title: 'Leave Feedback',
    fontWeight: 'bold',
    borderRadius: '10dp',
    borderColor: '#ffffff',
    color: '#ffffff',
    backgroundColor: '#a051be'
  });
  feedbackScreenView.add(continueButton);

  continueButton.addEventListener('touchstart', function () {
    continueButton.backgroundColor = '#ffffff';
    continueButton.color = '#a051be';
  });
  continueButton.addEventListener('endstart', function () {
    continueButton.backgroundColor = '#a051be';
    continueButton.color = '#ffffff';
  });



  continueButton.addEventListener('click', function () {
    Ti.App.fireEvent('CloseFeedbackScreen');
  });

  Ti.App.addEventListener('CloseFeedbackScreen', function () {
    //needs code to save feedback
    feedbackScreenView.animate({
      opacity: 0,
      duration: 200
    }, function() {
      feedbackScreenView.visible = false;
      win.leftNavButton = infoButton;
    });
    Ti.App.Properties.setBool('feedback.shown', true);
  });

  Ti.App.addEventListener('FeedbackScreen', function () {
    win.leftNavButton = null;
    feedbackScreenView.visible = true;
    feedbackScreenView.animate({
      opacity: 1,
      duration: 200
    });
  });
  win.add(feedbackScreenView);
  return feedbackScreenView;
};
