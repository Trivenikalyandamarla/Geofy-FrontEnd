var localConfigFile = "config/objects.json"; 

// read json file

$.getJSON(localConfigFile).done(function (data) {
  // console.log(data);
  $.each(data.objects, function (index, element) {
    // console.log(element);

    var objName = element.name;

    addLocalObjectDataModel(objName,element)
    
  })

  // addLocalObjectDataModel()
})

var orgConfigURL =
  "https://firebasestorage.googleapis.com/v0/b/geofy-ff511.appspot.com/o/config_file%2Forg_Config.json?alt=media";

function setDataToContainer(m_orgConfigDetailes) {
  $.each(m_orgConfigDetailes.list_of_obj, function (index, element) {
    // Object Type Add

    $("#objTypeSelect").append(
      `<option value="${element.Geometry_Type}">${element.Object_Name}</option>`
    );
  });
}
if (
  localStorage.getItem("orgConfigDetailes") === undefined ||
  localStorage.getItem("orgConfigDetailes") === null
) {
  $.getJSON(orgConfigURL).done(function (data) {
    orgConfigData = data;

    setDataToContainer(data);
    localStorage.setItem("orgConfigDetailes", JSON.stringify(orgConfigData));
  });
} else {
  l_orgConfigDetailes = JSON.parse(localStorage.getItem("orgConfigDetailes"));

  setDataToContainer(l_orgConfigDetailes);
}



