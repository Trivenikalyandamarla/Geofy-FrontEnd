// style function for TaskID

const taskIDStyle = function (feature,resolution) {
  var style;
  var taskID = feature.get("TaskID");
  var taskStatus = feature.get("TaskStatus");
  var taskType = feature.get("TaskType");
  var taskPriority = feature.get("TaskPriority");

  if(resolution > 10){
  }

  style = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 46],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      opacity: 1,
      src: "./img/pin.png",
    }),
    text: new ol.style.Text({
      font: "20px serif",
      text: taskID ,
      placement: "point",
      offsetX: 10,
      offsetY: 10,
      fill: new ol.style.Fill({
        color: "#000",
      }),
    }),
  });

  return [style];


  
}


// // defutStyle function for Drawing

colorList = { LV: "#F7A71B", MV: "#0000FF", HV: "#FF4FFF", EHV: "#ff0000" };

const styleFunction = function (feature, resolution) {
  Object_Name = feature.get("Object_Name");
  id = feature.get("ol_id");
  action = feature.get("action");

  var style;

  if (action === "remove" || resolution > 50) style = new ol.style.Style({});
  else if (Object_Name === "Pole")
    style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({
          color: colorList["LV"],
        }),
        stroke: new ol.style.Stroke({
          color: colorList["LV"],
          width: 1,
        }),
      }),
    });
  else if (Object_Name === "OH Line")
    style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: colorList["LV"],
        width: 3,
      }),
    });
  else if (Object_Name === "UG Cable")
    style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: colorList["LV"],
        lineDash: [10, 10],
        width: 3,
      }),
    });
  else if (Object_Name === "Substation")
    style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgb(31, 244, 77,0.5)",
      }),
      stroke: new ol.style.Stroke({
        color: "#000",
        width: 2,
      }),
    });
  else if (
    Object_Name === "DTR" ||
    Object_Name === "Power Transformer" ||
    Object_Name === "RMU" ||
    Object_Name === "Switching Station"
  )
    style = new ol.style.Style({
      image: new ol.style.Icon({
        opacity: 1,
        src: "./img/" + Object_Name + ".png",
      }),
    });
  else if (Object_Name === "Meter")
    style = new ol.style.Style({
      image: new ol.style.Icon({
        opacity: 1,
        src: "./img/" + Object_Name + "LV" + ".png",
      }),
    });
  else if (Object_Name === "FPB")
    style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: "#ffeabd",
      }),
      stroke: new ol.style.Stroke({
        color: "#000",
        width: 2,
      }),
    });
  else
    style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(41, 225, 242, 0.2)",
      }),
      stroke: new ol.style.Stroke({
        color: "#29e1f2",
        width: 3,
      }),
      // image: new ol.style.Circle({
      //   radius: 7,
      //   fill: new ol.style.Fill({
      //     color: "rgba(41, 225, 242,0.6)",
      //   }),
      //   stroke: new ol.style.Stroke({
      //     color: "rgba(41, 225, 242,0.8)",
      //     width: 1,
      //   }),
      // }),
      image: new ol.style.Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        opacity: 1,
        src: "./img/pin.png",
      }),
      text: new ol.style.Text({
        font: "20px serif",
        text: Object_Name + "-" + id,
        placement: "point",

        offsetX: 10,
        offsetY: 10,
        fill: new ol.style.Fill({
          color: "#000",
        }),
      }),
    });
  return [style];
};
