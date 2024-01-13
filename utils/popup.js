/**
 * Elements that make up the popup.
 */
const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");

/**
 * Create an overlay to anchor the popup to the map.
 */
const popup = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

map.addOverlay(popup);

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
// closer.onclick = function () {
//   popupCloser();
// };

function popupCloser() {
  popup.setPosition(undefined);
  return false;
}
