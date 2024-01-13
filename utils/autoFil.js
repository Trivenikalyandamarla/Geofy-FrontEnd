function setPreviousFill(data) {
  for (const [key, value] of Object.entries(data)) {
    sessionStorage.setItem(key, value);
  }
  sessionStorage.setItem("previousFillFound", "yes");
}

function getPreviousFill(data) {
  previousFill = {};
  for (const [key, value] of Object.entries(data)) {
    sessionStorage.getItem(key, value);
    previousFill[key] = value;
  }

  setPreviousFill_data(previousFill);
  return previousFill;
}

function setPreviousFill_data(previousFill) {
  for (const [key, value] of Object.entries(previousFill)) {
    sessionStorage.getItem(key, value);
    Field_Id = key.replace(/ /g, "");
    Field_Id = "#" + Field_Id;

    if (Field_Id == "#upload_img") {
    } else {
      $(Field_Id).val(value);
    }
  }
}

function setAttributData(data) {
  for (const [key, value] of Object.entries(data)) {
    Field_Id = key.replace(/ /g, "");
    Field_Id = "#" + Field_Id;

    if (Field_Id == "#upload_img") {
      if(value != undefined){
        $("#output_img").attr("src", value);
        $("#output_img").show();

      }
      
    } else {
      $(Field_Id).val(value);
    }
  }
}
