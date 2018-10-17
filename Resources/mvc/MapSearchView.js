// This view holds the search field

exports.createSearchField = function (win) {

  // Place a view behind the search field to hold other buttons, etc.
  var searchView = Ti.UI.createView({
    top: 10 + 'dp',
    left: 10 + 'dp',
    right: 10 + 'dp',
    height: 45 + 'dp',
    borderWidth: 1 + 'dp',
    borderColor: '#999999',
    backgroundColor: '#ffffff'
  });

  var searchImage = Ti.UI.createImageView({
    image: '/assets/icons/06-magnify.png',
    preventDefaultImage: true,
    left: 15 + 'dp',
    width: 20 + 'dp',
    height: 20 + 'dp',
    tintColor: '#999999'
  });
  searchView.add(searchImage);

  // Create the search field
  var searchField = Ti.UI.createTextField({
    autocorrect: false,
    hintText: 'Search for a place in Cary',
    left: 42 + 'dp',
    right: 10 + 'dp',
    height: Ti.UI.SIZE,
    // suppressReturn: false,
    autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS,
    clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
    borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
    // returnKeyType: Ti.UI.RETURNKEY_NEXT,
    // keyboardType: Ti.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION,
    color: '#333333',
    hintTextColor: '#999999',
    backgroundColor: '#ffffff'
  });
  searchView.add(searchField);

  searchField.addEventListener('focus', function (ev) {
    Ti.App.fireEvent('HidePlaceCard');
    Ti.App.fireEvent('ShowSearch');
  });

  searchField.addEventListener('return', function () {
    searchField.blur();
  });

  searchField.addEventListener('change', function (ev) {
    var text = ev.value;
    Ti.App.fireEvent('UpdateSearchResults', {
      text: text
    });
  });

  // Add Global Event Listeners
  Ti.App.addEventListener('HideSearch', function () {
    searchField.blur();
  });

  win.add(searchView);


  return searchField;
};
