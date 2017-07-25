var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.7489954, lng: -84.3879824},  // Atlanta center
    zoom: 13
  });
}
