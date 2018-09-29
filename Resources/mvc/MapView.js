
exports.createView = function (win) {

    /**
     * Show a map
     */
    var Map = require('ti.map');
    var mapView = Map.createView({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        mapType: Map.NORMAL_TYPE,
        region: {
            latitude: 35.789474,
            longitude: -78.781173,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
        },
        showPointsOfInterest: true,
        showsTraffic: true,
        animate: true,
        regionFit: true,
        userLocation: true,
        annotations: []
    });
    win.add(mapView);

    function updateMap(jsonResponse) {

        /**
         * Parse records and polygons
         * @type {any}
         */
        var json = JSON.parse(jsonResponse);
        console.log(JSON.stringify(json));

        if (json.features) {
            console.log("Found features...");
            var polygonData = [];
            for (var i = 0; i < json.features.length; i++) {
                console.log("Feature " + i);
                var record = json.features[i];
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
                        strokeColor: 'red',
                        fillColor: 'blue',
                        strokeWidth: 1
                    });
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
    }

    /**
     * Access the site data
     * @type {string}
     */
    var url = "http://codeforcary.org/parking/parking.geojson";
    var client = Ti.Network.createHTTPClient({
        onload : function(e) {
            console.log("Received server text: " + this.responseText);
            updateMap(this.responseText);
        },
        onerror : function(e) {
            Ti.API.debug(e.error);
            alert('error: falling back to data file');

            /**
             * Access a sample file
             */
            var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,
                'assets/data/parking.geojson');
            var blob = file.read();
            var text = blob.text;
            blob = null;
            file = null;
            updateMap(text);
        },
        timeout : 5000  // in milliseconds
    });
    // Prepare the connection
    client.open("GET", url);
    // Send the request
    console.log("Opening connection to: " + url);
    client.send();
};