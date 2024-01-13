// Tasks
var taskVectorSource = new ol.source.Vector();
const drawTaskID = new ol.layer.Vector({
  source: taskVectorSource,
  style: taskIDStyle,
});
map.addLayer(drawTaskID);

function closeTaskList() {
  $("#task_id_list_container").hide();
  $("#disableBG").hide();
}

function createNewTask() {
  closeTaskList();

  const draw = new ol.interaction.Draw({
    source: taskVectorSource,
    type: "Point",
  });
  map.addInteraction(draw);

  draw.on("drawend", function (evt) {
    map.removeInteraction(draw);
    var taskIDNumber = drawTaskID.getSource().getFeatures().length + 1;

    var feature = evt.feature;
    var TaskID = "Rajnish_Task_" + taskIDNumber;
    var creationDate = new Date().toISOString();
    feature.setProperties({
      TaskID: TaskID,
      creationDateTime: creationDate,
      TaskStatus: "TaskStatus",
      TaskType: "TaskType",
      TaskPriority: "TaskPriority",
    });

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

    addLocalTaskID(TaskID, asset);
  });
}

function taskFileter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("task_id_list_search");
  filter = input.value.toUpperCase();
  ul = document.getElementById("task_id_list");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
