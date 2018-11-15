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
        console.log("lotCentre: " + record.properties.lotcenter);
        var lotCenter = record.properties.lotcenter.split(',');
        //console.log("name: " + record.properties.name);
        if (record.geometry && record.geometry.coordinates) {
          var coordinates = record.geometry.coordinates[0];
          var points = [];
          for (var j = 0; j < coordinates.length; j++) {
            console.log("Coordinate: " + j);
            var point = {
              latitude: coordinates[j][1],
              longitude: coordinates[j][0]
            };
            points.push(point);
          }
          var polygon = Map.createPolygon({
            points: points,
            strokeColor: '#50000000',
            fillColor: '#500090BB',
            strokeWidth: 1
          });

          //Labels for parking polygons
          var price = Ti.UI.createLabel({
            //text : "P",//Number=12 Input from server
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
          //Annotaion for parking polygons
          var pin = Map.createAnnotation({
            latitude: lotCenter[1],
            longitude: lotCenter[0],
            title: record.properties.name,
            subtitle: "Standard: " + record.properties.stdParking + ", Handicap: " + record.properties.hcParking + ", Electric: " + record.properties.elecParking,
            image: anImageView.toBlob() //setting ImageView as blob
          });
          mapView.addAnnotation(pin);
          if (Ti.UI.Android) {
            mapView.addPolygon(polygon);
          } else {
            polygonData.push(polygon);
          }
        }
      }
      if (!Ti.UI.Android) {
        mapView.addPolygons(polygonData);
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
