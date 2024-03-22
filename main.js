var googleLayerSatellite = new ol.layer.Tile({
  title: "Google Satellite",
  type: "base",
  visible: false,
  source: new ol.source.TileImage({
    url: "https://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}",
  }),
});
var googleLayerRoadmap = new ol.layer.Tile({
  title: "Google Road Map",
  type: "base",
  visible: true,
  source: new ol.source.TileImage({
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  }),
});

window.map = new ol.Map({
  target: "map-container",
  layers: [googleLayerRoadmap, googleLayerSatellite],
  view: new ol.View({
    projection: "EPSG:3857",
    // center: ol.proj.fromLonLat([88.4876211, 22.5855179]),
    // zoom: 15,
    // center: [8925105.396850493, 2979933.0222854717],
    // zoom: 4.5,
    minZoom: 4,
    maxZoom: 22,
  }),
});

lastveiw = localStorage.getItem("lastView");
if (lastveiw != null) {
  lastveiw = JSON.parse(lastveiw);
  center = lastveiw.center;
  zoom = lastveiw.zoom;
  // map.getView().setCenter(center)
  // map.getView().setZoom(zoom)

  map.getView().animate({ center: center }, { zoom: zoom }, { duration: 1000 });
} else {
  map
    .getView()
    .animate(
      { center: [8925105.396850493, 2979933.0222854717] },
      { zoom: 4.5 }
    );
}

//myLocationlayer
const myLocationSrc = new ol.source.Vector();
const myLocationlayer = new ol.layer.Vector({
  source: myLocationSrc,
});

map.addLayer(myLocationlayer);

navigator.geolocation.watchPosition(
  function (pos) {
    const coords = [pos.coords.longitude, pos.coords.latitude];
    const accuracy = ol.geom.Polygon.circular(coords, pos.coords.accuracy);
    myLocationSrc.clear(true);
    myLocationSrc.addFeatures([
      new ol.Feature(
        accuracy.transform("EPSG:4326", map.getView().getProjection())
      ),
      new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat(coords))),
    ]);
  },
  function (error) {
    console.log(`ERROR: ${error.message}`);
  },
  {
    enableHighAccuracy: true,
  }
);

//Locate me Control
const locate = document.createElement("div");
locate.className = "ol-control ol-unselectable locate ";
locate.innerHTML = '<button title="Locate me">◎</button>';
locate.addEventListener("click", function () {
  if (!myLocationSrc.isEmpty()) {
    map.getView().fit(myLocationSrc.getExtent(), {
      maxZoom: 18,
      duration: 500,
    });
  }
});
map.addControl(
  new ol.control.Control({
    element: locate,
  })
);

//baseMap Control
const baseMap = document.createElement("div");
baseMap.className = "ol-control baseMap";
baseMap.innerHTML = `<select  onchange="getSelectedBaseMap(this)" id="baseMapSelect"> 
<option value="None">None</option> 
<option value="googleLayerSatellite">Satellite</option>
<option selected value="googleLayerRoadmap">Roadmap</option> 

</select>`;

function getSelectedBaseMap(selectObject) {
  if (selectObject.value == "googleLayerSatellite") {
    googleLayerSatellite.setVisible(true);
    googleLayerRoadmap.setVisible(false);
  } else if (selectObject.value == "googleLayerRoadmap") {
    googleLayerSatellite.setVisible(false);
    googleLayerRoadmap.setVisible(true);
  } else if (selectObject.value == "None") {
    googleLayerSatellite.setVisible(false);
    googleLayerRoadmap.setVisible(false);
  }
}
map.addControl(
  new ol.control.Control({
    element: baseMap,
  })
);

map.on("moveend", function lastView() {
  state = {
    center: map.getView().getCenter(),
    zoom: map.getView().getZoom(),
  };
  localStorage.setItem("lastView", JSON.stringify(state));

  $("#latLong").text(
    ol.proj.toLonLat(map.getView().getCenter())[1].toFixed(6) +
      "," +
      ol.proj.toLonLat(map.getView().getCenter())[0].toFixed(6)
  );
  $("#zoom").text(map.getView().getZoom().toFixed(0) + "z");
});

// draw layer

window.drawsource = new ol.source.Vector();
window.newObjLayer = new ol.layer.Vector({
  source: drawsource,
  style: styleFunction,
});

map.addLayer(newObjLayer);

// Select Object

const selected = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({
      color: "rgb(242, 31, 17,.6)",
    }),
    stroke: new ol.style.Stroke({
      color: "rgb(242, 31, 17,.6)",
      width: 1,
    }),
  }),
  fill: new ol.style.Fill({
    color: "rgb(242, 31, 17,.6)",
  }),
  stroke: new ol.style.Stroke({
    color: "rgb(242, 31, 17,.6)",
    width: 2,
  }),
});

function selectStyle(feature) {
  const color = feature.get("COLOR") || "rgb(242, 31, 17,.6)";
  selected.getFill().setColor(color);
  return selected;
}

// select interaction working on "click"
const selectClick = new ol.interaction.Select({
  condition: ol.events.condition.click,
  style: selectStyle,
  layers: [newObjLayer],
  hitTolerance: 10,
});

showSelection();
function showSelection() {
  map.addInteraction(selectClick);
  selectClick.on("select", function (e) {
    var feature = e.selected[0];
    if (feature != undefined) {
      var properties = feature.getProperties();
      Object_Name = feature.get("Object_Name");
      var coordinates = feature.getGeometry().getLastCoordinate();
      var drawBtnDataTemplet = `${localStorage.getItem(
        Object_Name
      )}<!--Popup Control-->
                  <div id="drawPopupControl" style="margin-top: 15px; float: left; width: 50%;">
                   <button  id="objdeleteButton" style="background:#fff;color: red;border-radius: 5px"> <i class="fa fa-trash"></i> Delete </button>
                  </div>
                  <div style="margin-top: 15px;text-align:right">
                  <button id="cancelEditButton" style="background: #fff; border-radius: 15px 0 0 15px" >Cancel</button>
                  <button id="attributEditButton" style="color:white;background: forestgreen;border-radius: 0 15px 15px 0">SAVE</button>
                  </div>
            
            `;
      content.innerHTML = "";
      content.innerHTML = drawBtnDataTemplet;

      popup.setPosition(coordinates);
      setAttributData(properties);

      $("#objdeleteButton").click(function deletFeature() {
        DayPilot.Modal.confirm("Are you sure?", {
          top: 40,
          okText: "Yes",
          cancelText: "No",
        }).then(function (args) {
          if (args.result) {
            //drawsource.removeFeature(feature);
            feature.set("action", "remove");
            popupCloser();
            saveIndexedDB(feature);
            selectClick.getFeatures().clear();
            showSuceessAlert("Object deleted");
          }
        });

        // var check = confirm("Are you sure you want to delete this object ?");
        // if (check) {
        //   drawsource.removeFeature(feature);
        //   popupCloser();
        //   showSuceessAlert("Object deleted");
        // }
      });
      $("#cancelEditButton").click(function cancelEditButton() {
        popupCloser();
        selectClick.getFeatures().clear();
      });

      $("#attributEditButton").click(function attributEditButton() {
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
          var modifyDate = new Date().toISOString();
          feature.set("modifyDate", modifyDate);
          feature.set("action", feature.get("action") + "," + "edit");
          feature.setProperties(objProp);
          setPreviousFill(objProp);
          popupCloser();
          showSuceessAlert("Object added");
          saveIndexedDB(feature);
          selectClick.getFeatures().clear();
          $("#objTypeSelect").val("defult").change();
        } else {
          showWaringAlert("Fill Required Fields");
        }
      });
    } else {
      popupCloser();
    }
  });
}

$("#logo").on("dblclick", function () {
  DayPilot.Modal.confirm("Do you want to Reload?", {
    top: 40,
    okText: "Yes",
    cancelText: "No",
  }).then(function (args) {
    if (args.result) {
      localStorage.clear();
      window.location.href = "index.html";
    }
  });
});

//  imge resize

function resizeBase64Img(base64, newWidth, newHeight) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    let context = canvas.getContext("2d");
    let img = document.createElement("img");
    img.src = base64;
    img.onload = function () {
      context.scale(newWidth / img.width, newHeight / img.height);
      context.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
  });
}

// image load
function preview_image(event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("output_img");
    // output.src = reader.result;
    // output.style.display = "block";

    resizeBase64Img(reader.result, 144, 256).then((resized) => {
      output.src = resized;
      output.style.display = "block";
    });
  };
  reader.readAsDataURL(event.target.files[0]);
}

$("#userObjMenu").on("click", function () {
  $("#object_list_container").toggle();
  $("#disableBG").toggle();
});

$("#pinMenu").click(function () {
  // on map get coordinate
  map.once("singleclick", function (evt) {
    if (evt.dragging) {
      return;
    }
    var coordinate = map.getEventCoordinate(evt.originalEvent);
    var lonlat = ol.proj.toLonLat(coordinate);
    lat = lonlat[1].toFixed(6);
    lon = lonlat[0].toFixed(6);

    $("#gloableSearch").val(lat + "," + lon);
    $("#gloableSearch").trigger("keyup");
  });
});
