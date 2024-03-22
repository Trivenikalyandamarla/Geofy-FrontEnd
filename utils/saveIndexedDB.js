var db;
var request = window.indexedDB.open("Geofy_Storage", 1);

request.onerror = function (event) {
  console.log("error: ");
};

request.onsuccess = function (event) {
  db = request.result;
  console.log("success: " + db);
  readAll();
  loadLocalConfig()

  
};

request.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore("localDrawing", {
    keyPath: "task_id",
  });
  var objectStoreTaskID = db.createObjectStore("localObjectDataModel", {
    keyPath: "objName",
  });
};

function read(taskid) {
  var transaction = db.transaction(["localDrawing"]);
  var objectStore = transaction.objectStore("localDrawing");
  var request = objectStore.get(taskid);

  request.onerror = function (event) {
    console.log("Unable to retrieve daa from database!");
  };

  request.onsuccess = function (event) {
    // Do something with the request.result!
    if (request.result) {
      features = request.result.asset;
    } else {
      console.log("Couldn't be found in your database!");
    }
  };
}

function deletFeature(taskid, ol_id) {
  var transaction = db.transaction(["localDrawing"]);
  var objectStore = transaction.objectStore("localDrawing");
  var request = objectStore.get(taskid);

  request.onerror = function (event) {
    console.log("Unable to retrieve daa from database!");
  };

  request.onsuccess = function (event) {
    // Do something with the request.result!
    if (request.result) {
      features = request.result.asset;
    } else {
      console.log("Couldn't be found in your database!");
    }
  };
}

function readAll() {
  var objectStore = db.transaction("localDrawing").objectStore("localDrawing");
  var objectStoreTaskID = db.transaction("localObjectDataModel").objectStore("localObjectDataModel");

  objectStore.openCursor().onsuccess = function (event) {
    var cursor = event.target.result;

    if (cursor) {
      feature = cursor.value.asset;
      geojsonObj = {
        type: "FeatureCollection",
        features: feature,
      };
      drawsource.addFeatures(new ol.format.GeoJSON().readFeatures(geojsonObj));

      cursor.continue();
    } else {
      // console.log("No more entries!");
    }
  };
}

function addLocalObjectDataModel(i, j) {
  var transaction = db.transaction(["localObjectDataModel"], "readwrite");
  var objectStore = transaction.objectStore("localObjectDataModel");
  var request = objectStore.get(i);

  request.onsuccess = function (event) {
    objectStore.add({objName:i,value:j});
    console.log("New localObjectDataModel Added");
  };

  request.onerror = function (event) {
    console.log("Unable to add data is aready exist in your database! ");
  };
}
function addLocalDrawing(i, j) {
  var value = {
    task_id: i,
    asset: [],
  };
  value.asset.push(j);

  var transaction = db.transaction(["localDrawing"], "readwrite");
  var objectStore = transaction.objectStore("localDrawing");
  var request = objectStore.get(i);

  request.onsuccess = function (event) {
    if (request.result) {
      allObj = request.result.asset;

      var isAlredyExist = false;

      $.each(allObj, function (i, item) {
        if (item.properties.ol_id == j.properties.ol_id) {
          // console.log("AlredyExist");
          isAlredyExist = true;
        }
      });

      if (isAlredyExist) {
        // Specify the property and value to match
        const propertyToMatch = "ol_id";
        const valueToMatch = j.properties.ol_id;

        // Use the filter method to create a new array without the matching records
        const newAllObj = allObj.filter(
          (item) => item.properties[propertyToMatch] !== valueToMatch
        );
        // Output the filtered array

        value["asset"] = newAllObj;
        value.asset.push(j);
        objectStore.put(value);

        console.log("updated to database.");
      } else {
        value["asset"] = allObj;
        value.asset.push(j);
        objectStore.put(value);
        console.log("added to database.");
      }
    } else {
      objectStore.add(value);

      console.log("New Task Id Added");
    }
  };

  request.onerror = function (event) {
    console.log("Unable to add data is aready exist in your database! ");
  };
}

function removeLocalDrawing(i, j) {
  var value = {
    task_id: i,
    asset: [],
  };
  value.asset.push(j);

  var transaction = db.transaction(["localDrawing"], "readwrite");
  var objectStore = transaction.objectStore("localDrawing");
  var request = objectStore.get(i);

  request.onsuccess = function (event) {
    if (request.result) {
      allObj = request.result.asset;

      var isAlredyExist = false;

      $.each(allObj, function (i, item) {
        if (item.properties.ol_id == j.properties.ol_id) {
          console.log("AlredyExist");
          isAlredyExist = true;
        }
      });

      if (isAlredyExist) {
        // Specify the property and value to match
        const propertyToMatch = "ol_id";
        const valueToMatch = j.properties.ol_id;

        // Use the filter method to create a new array without the matching records
        const newAllObj = allObj.filter(
          (item) => item.properties[propertyToMatch] !== valueToMatch
        );
        // Output the filtered array

        value["asset"] = newAllObj;
        objectStore.put(value);
        console.log("obj removed from database.");
      } else {
        console.log("Obj Not Found");
      }
    }
  };

  request.onerror = function (event) {
    console.log("Unable to add data is aready exist in your database! ");
  };
}
