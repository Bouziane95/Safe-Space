import APIHandler from "./APIHandler.js";
const adressAPI = new APIHandler(
  "https://api.mapbox.com/geocoding/v5/mapbox.places"
);

const formMapEvent = document.querySelector(".form-card");
const map = document.getElementById("map");
const removeFormMapEvent = document.getElementById("return-button");

function removeForm() {
  formMapEvent.style.display = "none";
}

removeFormMapEvent.onclick = removeForm;

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
    adressAPI
      .createAdress({ lat: latitude, lng: longitude })
      .then((response) => {
        const adress = response.data;
        document.getElementById("coordinateLat").value = adress.query[0];
        document.getElementById("coordinateLong").value = adress.query[1];
        document.getElementById("adress").value = adress.features[0].place_name;
      })
      .catch((error) => {
        console.log(error);
      });

    formMapEvent.style.display = "flex";

    var marker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);
    console.log(latitude, longitude);
  });
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
