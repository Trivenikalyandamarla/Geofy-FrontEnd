function showSuceessAlert(msg) {
  $("#successmsg").text(msg);
  $("#success-alert").slideDown(500);
  $("#success-alert").fadeTo(2000, 500).slideUp(500);
}

function showWaringAlert(msg) {
  $("#warningmsg").text(msg);
  $("#warning-alert").slideDown(500);
  $("#warning-alert").fadeTo(2000, 500).slideUp(500);
}
