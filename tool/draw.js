window.drawflag = false;

let draw,
  snap,
  modify,
  objProp = {};

snap = new ol.interaction.Snap({ source: drawsource });

$("#drawBtn").click(function () {
  $("#objTypeSelect").val("defult").change();
  $("#drawObjSelect").toggle();
  if ($("#drawObjSelect").is(":visible")) {
    $("#latLongZoom").hide();
    map.removeInteraction(selectClick);
    const select = new ol.interaction.Select({
      layers: [newObjLayer],
      hitTolerance: 10,
    });
    map.addInteraction(select);
    modify = new ol.interaction.Modify({
      features: select.getFeatures(),
      source: drawsource,
    });
    map.addInteraction(modify);
    map.addInteraction(snap);

    modify.on("modifyend", function (evt) {
      var feature = evt.features.getArray();
      var modifyDate = new Date().toISOString();
      showSuceessAlert("Object Modified");
      for (var i = 0; i < feature.length; i++) {
        feature[i].set("modifyDate", modifyDate);
        feature[i].set("action", feature[i].get("action") + "," + "modified");
        saveIndexedDB(feature[i]);
      }
    });

    $("#objTypeSelect").on("change", function () {
      map.removeInteraction(draw);

      if ($("#objTypeSelect option:selected").val() == "defult") {
      } else {
        const select = new ol.interaction.Select({
          layers: [newObjLayer],
          hitTolerance: 10,
        });
        map.addInteraction(select);
        modify = new ol.interaction.Modify({
          features: select.getFeatures(),
          source: drawsource,
        });
        map.addInteraction(modify);
        map.addInteraction(snap);

        modify.on("modifyend", function (evt) {
          var feature = evt.features.getArray();
          var modifyDate = new Date().toISOString();
          showSuceessAlert("Object Modified");
          for (var i = 0; i < feature.length; i++) {
            feature[i].set("modifyDate", modifyDate);
            feature[i].set(
              "action",
              feature[i].get("action") + "," + "modified"
            );
            saveIndexedDB(feature[i]);
          }
        });

        // Limit multi-world panning to one world east and west of the real world.
        // Geometry coordinates have to be within that range.
        const extent = ol.proj.get("EPSG:3857").getExtent().slice();
        extent[0] += extent[0];
        extent[2] += extent[2];

        const typeSelect = document.getElementById("objTypeSelect");
        var Object_Name = $("#objTypeSelect option:selected").text();

        function addInteractions() {
          var geotype = typeSelect.value;
          // var Object_Name = $("#objTypeSelect option:selected").text();
          // console.log(Object_Name, geotype);
          draw = new ol.interaction.Draw({
            source: drawsource,
            type: geotype,
          });
          map.addInteraction(draw);
          map.addInteraction(snap);

          draw.on("drawstart", function () {
            drawflag = true;
          });

          draw.on("drawend", function (evt) {
            drawflag = false;
            var feature = evt.feature;

            var coordinates = feature.getGeometry().getLastCoordinate();

            // console.log(Object_Name, geotype);
            var drawBtnDataTemplet = `${localStorage.getItem(
              Object_Name
            )}<!--Popup Control-->
                  <div id="drawPopupControl" style="margin-top: 15px; float: left; width: 50%;">
                   <!-- <button id="objdeleteButton" style="background:#fff;color: red;border-radius: 5px"> <i class="fa fa-trash"></i> Delete </button> -->
                  </div>
                  <div style="margin-top: 15px;text-align:right">
                  <button onclick="objcancelProp()" id="cancelButton" style="background: #fff; border-radius: 15px 0 0 15px" >Cancel</button>
                  <button onclick="objsaveProp()" id="objsaveButton" style="color:white;background: forestgreen;border-radius: 0 15px 15px 0">SAVE</button>
                  </div>
            
            `;
            content.innerHTML = "";
            content.innerHTML = drawBtnDataTemplet;

            popup.setPosition(coordinates);

            getPreviousFill(objProp);

            objNetworkType = document.getElementById(
              "objNetworkTypeSelect"
            ).value;
            //

            var creationDate = new Date().toISOString();

            ol_id = drawsource.getFeatures().length + 1;

            feature.setProperties({
              ol_id: ol_id,
              action: "add",
              Object_Name: Object_Name,
              "Network Type": objNetworkType,
              creationDateTime: creationDate,
            });
          });
        }

        /**
         * Handle change event.
         */

        addInteractions();
      }
    });
  } else {
    $("#latLongZoom").show();
    showSelection();
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    map.removeInteraction(modify);
  }
});

function objcancelProp() {
  popupCloser();
  removeLastFeature();
  showWaringAlert("Object Not added");
}
function objsaveProp() {
  var check = true;
  var counter = 1;
  $("#objProp_Form :input").each(function () {
    if (
      ($(this).attr("required") && $(this).val() == "") ||
      $(this).val() == null
    ) {
      if (counter == 1) {
        $(this).focus();
        check = false;
      }
      counter = counter + 1;
    }
    if ($(this).attr("name").length > 0) {
      if ($(this).attr("name") == "upload_img") {
        objProp[$(this).attr("name")] = $("#output_img").attr("src");
      } else {
        objProp[$(this).attr("name")] = $(this).val();
      }
    }
  });

  if (check) {
    addLastFeature();
  } else {
    showWaringAlert("Fill Required Fields");
  }
  function addLastFeature() {
    var features = drawsource.getFeatures();
    var lastFeature = features[features.length - 1];
    lastFeature.setProperties(objProp);
    setPreviousFill(objProp);
    popupCloser();
    showSuceessAlert("Object added");
    saveIndexedDB(lastFeature);
    $("#objTypeSelect").val("defult").change();
  }
}

$("#drawSave").click(function () {
  saveLocal();
});

function removeLastFeature() {
  var features = drawsource.getFeatures();
  var lastFeature = features[features.length - 1];
  drawsource.removeFeature(lastFeature);
}

function saveIndexedDB(feature) {
  properties = feature.getProperties();
  // console.log(feature.getGeometry().getCoordinates());
  // console.log(ol.proj.toLonLat(feature.getGeometry().getCoordinates()));

  delete properties.geometry;
  let asset = {
    type: "Feature",
    properties: properties,
    geometry: {
      coordinates: feature.getGeometry().getCoordinates(),
      type: feature.getGeometry().getType(),
    },
  };
  addLocalDrawing("Rajnish_Task_01", asset);
}
