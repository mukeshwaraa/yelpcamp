
var map;
function initMap1() {
  map = new mappls.Map('map', {
    center: [28.61, 77.23],
    zoomControl: true,
    location: true
  });
  Marker1 = new mappls.Marker({
    map: map,
    position: {"lat": 28.519467,"lng": 77.223150 },
    fitbounds: true,
    popupHtml: '<div>MapmyIndia</div>'
  });
}