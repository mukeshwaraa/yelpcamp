
var map;
function initMap1() {
  map = new mappls.Map('map', {
    center: [c.location.lat,c.location.long],
    zoomControl: true,
    location: true,
    
  });
  Marker1 = new mappls.Marker({
    map: map,
    position: {"lat": c.location.lat,"lng": c.location.long },
    fitbounds: true,
    popupHtml: `<div>${c.name}</div>`
  });
}