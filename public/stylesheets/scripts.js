import APIHandler from "./APIHandler.js";
const adressAPI = new APIHandler(
  "https://api.mapbox.com/geocoding/v5/mapbox.places"
);

const safeSpaceAPI = new APIHandler();
const formMapEvent = document.querySelector(".form-card");
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

  // map.on("load", function () {
  //   map.loadImage("/images/Frank.png", function (error, image) {
  //     if (error) throw error;
  //     map.addImage("frank-icon", image);
  //     map.addSource("point", {
  //       type: "geojson",
  //       data: {
  //         type: "FeatureCollection",
  //         features: [
  //           {
  //             type: "Feature",
  //             geometry: {
  //               type: "Point",
  //               coordinates: [crd.longitude, crd.latitude],
  //             },
  //           },
  //         ],
  //       },
  //     });
  //     map.addLayer({
  //       id: "points",
  //       type: "symbol",
  //       source: "point",
  //       layout: {
  //         "icon-image": "frank-icon",
  //         "icon-size": 0.25,
  //       },
  //     });
  //   });
  // });

  map.on("load", () => {
    safeSpaceAPI
      .get("/map")
      .then((response) => {
        const event = response.data;
        for (let i = 0; i < event.length; i++) {
          var time = event[i].time;
          var timeClean = time.replace("T", " ");
          var marker = new mapboxgl.Marker()
            .setLngLat([
              event[i].coordinates.latitude,
              event[i].coordinates.longitude,
            ])
            .setPopup(
              new mapboxgl.Popup({
                closeOnMove: true,
              }).setHTML(
                `<center><h4>${timeClean}</h4></center><p>${event[i].address}</p><p>${event[i].details}</p>`
              )
            )
            .addTo(map);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );

  var marker = new mapboxgl.Marker({
    color: "#FA8072",
  })
    .setLngLat([crd.longitude, crd.latitude])
    .addTo(map);

  map.on("dblclick", function (e) {
    var latitude = e.lngLat.lat;
    var longitude = e.lngLat.lng;
    adressAPI
      .createAdress({ lat: latitude, lng: longitude })
      .then((response) => {
        const adress = response.data;
        console.log(adress);
        document.getElementById("coordinateLat").value = adress.query[0];
        document.getElementById("coordinateLong").value = adress.query[1];
        document.getElementById("adress").value = adress.features[0].place_name;
        var marker = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({
              closeOnMove: true,
            }).setHTML(
              `<center><h4>N'oubliez pas de renseigner la date et l'heure</h4></center><p>${adress.features[0].place_name}</p><p>Sans oublier les détails</p>`
            )
          )
          .addTo(map);
      })
      .catch((error) => {
        console.log(error);
      });

    formMapEvent.style.display = "flex";
  });
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  if (err.code == 1) {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYm91Ym91OTUiLCJhIjoiY2tmbWRmdTduMDYxZjM1bWU5ejU3OHU2cyJ9.qVQnw89kJEBWHTsbyV2sBQ";

    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v10",
      zoom: 11,
      center: [78.3430302, 17.449968],
    });

    map.on("load", () => {
      safeSpaceAPI
        .get("/map")
        .then((response) => {
          const event = response.data;
          for (let i = 0; i < event.length; i++) {
            var marker = new mapboxgl.Marker()
              .setLngLat([
                event[i].coordinates.latitude,
                event[i].coordinates.longitude,
              ])
              .setPopup(
                new mapboxgl.Popup({
                  closeOnMove: true,
                }).setHTML(
                  `<center><h4>${event[i].time}</h4></center><p>${event[i].address}</p><p>${event[i].details}</p>`
                )
              )
              .addTo(map);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });

    map.on("dblclick", function (e) {
      var latitude = e.lngLat.lat;
      var longitude = e.lngLat.lng;
      adressAPI
        .createAdress({ lat: latitude, lng: longitude })
        .then((response) => {
          const adress = response.data;
          console.log(adress);
          document.getElementById("coordinateLat").value = adress.query[0];
          document.getElementById("coordinateLong").value = adress.query[1];
          document.getElementById("adress").value =
            adress.features[0].place_name;
          var marker = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({
                closeOnMove: true,
              }).setHTML(
                `<center><h4>N'oubliez pas de renseigner la date et l'heure</h4></center><p>${adress.features[0].place_name}</p><p>Sans oublier les détails</p>`
              )
            )
            .addTo(map);
        })
        .catch((error) => {
          console.log(error);
        });

      formMapEvent.style.display = "flex";
    });
  }
}

navigator.geolocation.getCurrentPosition(success, error, options);
