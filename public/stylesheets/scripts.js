var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  var crd = pos.coords;

  mapboxgl.accessToken =
    "pk.eyJ1IjoiYm91Ym91OTUiLCJhIjoiY2tmbWRmdTduMDYxZjM1bWU5ejU3OHU2cyJ9.qVQnw89kJEBWHTsbyV2sBQ";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    zoom: 11,
    center: [crd.longitude, crd.latitude],
  });

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );

  var marker = new mapboxgl.Marker()
    .setLngLat([crd.longitude, crd.latitude])
    .addTo(map);

  map.on("click", function (e) {
    var latitude = e.lngLat.lat;
    var longitude = e.lngLat.lng;

    var marker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);
  });
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
