var Map = require('ti.map');
var LastAnnotation = {};

exports.createMapView = function (win) {

  // Create the map
  var mapView = Map.createView({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    mapType: Map.NORMAL_TYPE,
    region: {
      latitude: 35.784956,
      longitude: -78.781237,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    },
    showPointsOfInterest: true,
    showsTraffic: true,
    animate: true,
    regionFit: true,
    // userLocation: true,
    annotations: []
  });
  win.add(mapView);

  //Reusable labels for parking polygons
  var parkingImage;
  if (Ti.UI.iOS) {
    // Create a native label
    var parkingView = Ti.UI.createView({
      width: '20dp',
      height: '20dp',
      borderRadius: '3dp',
      backgroundColor: '#3F51B5'
    });
    var parkingLabel = Ti.UI.createLabel({
      text: 'P',
      color: '#ffffff',
      font: {fontSize: '15dp', font: "monospace", fontWeight: "bold"}
    });
    parkingView.add(parkingLabel);
    parkingImage = parkingView.toImage();
  } else {
    // Android issue so use this for now
    var price = Ti.UI.createLabel({
      color: 'black',
      font: {fontSize: '15dp', font: "monospace", fontWeight: "bold"},
      height: '30dp',
      width: '30dp',
      left: '50%',
      backgroundImage: '/assets/icons/icons8-parking-50.png'
    });
    //Convert labels into images to be used in an annotation
    var anImageView = Ti.UI.createImageView({
      image: price.toImage(), //setting label as a blob
      width: 'auto',
      height: 'auto'
    });
    parkingImage = anImageView.toBlob();
  }

  // Create a go button
  var goButton = Ti.UI.createView({
    width: '50dp',
    height: '50dp',
    borderWidth: '5dp',
    borderColor: '#ffffff',
    borderRadius: '15dp',
    backgroundColor: '#6FBE51'
  });
  var goLabel = Ti.UI.createLabel({
    text: 'GO',
    color: '#ffffff',
    width: '25dp',
    height: '25dp',
    font: {fontSize: '15dp', fontWeight: "bold"}
  });
  goButton.add(goLabel);

  // Add Global Event Listeners
  Ti.App.addEventListener('UpdateParkingLots', function (json) {
    // Updates the parking lots on the map
    console.log(JSON.stringify(json));
    if (json !== undefined && json.features) {
      console.log("Found features...");
      var polygonData = [];
      for (var i = 0; i < json.features.length; i++) {
        console.log("Feature " + i);
        var record = json.features[i];
        //console.log("lotCentre: " + record.properties.lotcenter);
        var lotCenter = record.properties.lotcenter.split(',');
        //console.log("name: " + record.properties.name);
        if (record.geometry && record.geometry.coordinates) {
          var coordinates = record.geometry.coordinates[0];
          var points = [];
          for (var j = 0; j < coordinates.length; j++) {
            var point = {
              latitude: coordinates[j][1],
              longitude: coordinates[j][0]
            };
            points.push(point);
          }
          var polygon = Map.createPolygon({
            points: points,
            //strokeColor: '#50000000',
            //fillColor: '#500090BB',
            strokeColor: record.properties.stroke,
            fillColor: record.properties.fill,
            strokeWidth: 1
          });

          // Annotation for parking polygons
          var annotationText = "";
          if (record.properties.stdParking && record.properties.stdParking > 1) {
            annotationText += record.properties.stdParking + " spots";
            if (record.properties.hcParking && record.properties.hcParking > 1) {
              annotationText += ", " + record.properties.hcParking + " handicap";
            }
            if (record.properties.elecParking && record.properties.elecParking > 1) {
              annotationText += ", " + record.properties.elecParking + " electric";
            }
          }

          //Append any Restriction(s) or note(s) to an annotation
          var strRestNoteAntText = "";
          if (record.properties.restrictions && record.properties.restrictions != '') {
            strRestNoteAntText = "\nRestrictions: " + record.properties.restrictions;
          }
          if (record.properties.note && record.properties.note != '') {
            strRestNoteAntText += "\nNote: " + record.properties.note;
          }
          //For Android only, show in the rightPane. Will show in an OptionDialog for iOS later
          if (Ti.UI.Android) {
            annotationText += strRestNoteAntText;
          }

          var annotationArgs = {
            latitude: lotCenter[1],
            longitude: lotCenter[0],
            title: record.properties.name,
            subtitle: annotationText,
            image: parkingImage,
            record: record,
            strRestNoteAntText: strRestNoteAntText
          };
          if (Ti.UI.iOS) {
            annotationArgs.rightView = goButton;
          } else {
            annotationArgs.rightButton = '/assets/icons/go-button.png';
          }
          var pin = Map.createAnnotation(annotationArgs);
          if (record.properties.active=='true'){
          mapView.addAnnotation(pin);
          }
          if (Ti.UI.Android && record.properties.active=='true') {
            mapView.addPolygon(polygon);
          } else {
            polygonData.push(polygon);
          }
        }
      }
      if (!Ti.UI.Android && record.properties.active=='true') {
        mapView.addPolygons(polygonData);
      }
    }
  });

  mapView.addEventListener('click', function (e) {
    var source = e.clicksource;
    console.log(source);
    if (source !== 'infoWindow' && source !== 'rightPane') {
      return;
    }
    var annotation = e.annotation;
    if (!annotation) {
      return;
    }
    var latitude = annotation.latitude;
    var longitude = annotation.longitude;
    var record = annotation.record;
    console.log(source + ' lat/long: ' + latitude + ', ' + longitude);

    var entryGeoPoint = record.properties.entrance1.split(',');
    var strRestNoteAntText = annotation.strRestNoteAntText;

    if (Ti.UI.Android) { //Open maps
      Ti.Platform.openURL("http://maps.google.com/?daddr=" + entryGeoPoint[1] + "," + entryGeoPoint[0]);
    } else { //Create an OptionDialog to display restrictions & notes for iOS
      var opts = {
        title: 'Please Note',
        cancel: 1,
        buttonNames: ['Continue', 'Cancel'],
        message: strRestNoteAntText
      };
      var dialog = Ti.UI.createAlertDialog(opts);
      dialog.addEventListener('click', onSelectDialog);
      dialog.show();

      //Helper function for handling OptionDialog selections
      function onSelectDialog(e) {
        if (e.index === e.source.cancel) {
          return;
        }
        Ti.Platform.openURL("maps://?daddr=" + entryGeoPoint[1] + "," + entryGeoPoint[0]);
      }
    }
  });

  Ti.App.addEventListener('ShowMapMarker', function (ev) {
    var record = ev.record;
    mapView.removeAnnotation(LastAnnotation);
    var annotation = Map.createAnnotation({
      latitude: record.latitude,
      longitude: record.longitude,
      title: record.name,
      subtitle: record.address,
      pincolor: Map.ANNOTATION_RED
    });
    mapView.addAnnotation(annotation);
    LastAnnotation = annotation; //Save to remove it the next time when a new search is made
    // var region = mapView.getRegion();
    mapView.setLocation({
      latitude: record.latitude,
      longitude: record.longitude,
      latitudeDelta: 0.006,
      longitudeDelta: 0.006,
      // latitudeDelta: region.latitudeDelta,
      // longitudeDelta: region.longitudeDelta,
      animate: true
    });
  });

  return mapView;
};
