// declare vars to populate later
var routetitle,
  routeDescription,
  writeFeatures,
  routeScreenshot,
  routePNG,
  tags;
function saveLocal() {
  var allFeatures = drawsource.getFeatures();
  var format = new ol.format.GeoJSON();
  writeFeatures = format.writeFeatures(allFeatures, {
    featureProjection: "EPSG:3857",
    decimals: 8,
  });
  writeFeatures = JSON.parse(writeFeatures);
  writeFeatures.crs = {
    type: "name",
    properties: {
      name: "EPSG:3857",
    },
  };
  console.log(writeFeatures);

  function exportJson(featuresCollection) {
    var txtArray = [];
    txtArray.push(JSON.stringify(featuresCollection));

    // Here I use the saveAs library to export the JSON as *.txt file

    var blob = new Blob(txtArray, { type: "text/json;charset=utf8" });
    saveAs(blob, "Task" + ".json");
  }

  // Call the function to export the GeoJSON
  exportJson(writeFeatures);
}
