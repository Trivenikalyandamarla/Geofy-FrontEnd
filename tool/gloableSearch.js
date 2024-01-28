var li = document.createElement("li");

function useRegex(input) {
  let regex = /[0-9]*\.[0-9]+,[0-9]*\.[0-9]+/i;
  return regex.test(input);
}
function gloableSearch(val) {
  var nominatim =
    "https://nominatim.openstreetmap.org/search?format=json&limit=5&q=" + val;

  if (useRegex(val)) {
    var latlon = val.split(",");
    var lat = latlon[0];
    var lon = latlon[1];
    viewSearchResult(lat, lon, val);
    return;
  }

  if (val.length >= 3) {
    document.getElementById("search-results").innerHTML = "";
    $.getJSON(nominatim, function (data) {
      document.getElementById("search-results").innerHTML = "";
      data.forEach(function (item, index) {
        li.innerHTML = item.display_name;
        li.setAttribute("lat", item.lat);
        li.setAttribute("lon", item.lon);
        li.setAttribute("name", item.name);
        li.setAttribute("class", "list-group-item list-group-item-action");
        document.getElementById("search-results").appendChild(li);
        li.addEventListener("click", function () {
          var lat = this.getAttribute("lat");
          var lon = this.getAttribute("lon");
          var name = this.getAttribute("name");
          viewSearchResult(lat, lon, name);
        });
      });
    });
  } else {
    document.getElementById("search-results").innerHTML = "";
  }
}

function viewSearchResult(lat, lon, name) {
  
  li.innerHTML = '<i class="fa fa-history" aria-hidden="true"></i> '+name;
  li.setAttribute("lat", lat);
  li.setAttribute("lon", lon);
  li.setAttribute("name", name);
  li.setAttribute("class", "list-group-item list-group-item-action");

  var marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
    name: name,
  });

  var markerlayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [marker],
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        opacity: 1,
        src: "./img/pin.png",
      }),
      text: new ol.style.Text({
        font: "20px serif",
        text: name,
        placement: "point",
        offsetX: 10,
        offsetY: 10,
        fill: new ol.style.Fill({
          color: "#000",
        }),
      }),
    }),
  });
  map.addLayer(markerlayer);
  map.getView().setCenter(ol.proj.fromLonLat([lon, lat]));
  //   map.getView().setZoom(13);
  document.getElementById("search-results").innerHTML = "";

  setTimeout(function () {
    map.removeLayer(markerlayer);
    $("#gloableSearch").val("");
  }, 10000);
}

// if gloableSearch focous show history Search

$("#gloableSearch").on("click", function () {
  li.style.display = "block";
  document.getElementById("search-results").appendChild(li);
  $("#search-results").css("display", "block");
});
