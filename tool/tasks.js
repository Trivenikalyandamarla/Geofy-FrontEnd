// Tasks
var taskVectorSource = new ol.source.Vector();
const drawTaskID = new ol.layer.Vector({
  source: taskVectorSource,
  style: taskIDStyle,
});
map.addLayer(drawTaskID);

function closeTaskList() {
  $("#object_list_container").hide();
  $("#disableBG").hide();
}

function createNewObject() {
  closeTaskList();

  // addLocalTaskID(TaskID, asset);
}

function taskFileter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("task_id_list_search");
  filter = input.value.toUpperCase();
  ul = document.getElementById("task_id_list");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
  


}
