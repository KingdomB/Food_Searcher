var corsProxy = "https://cors-anywhere.herokuapp.com/";

var mapCenter = { lat: 33.749, lng: -84.388 };
var map;
var infowindow;

// displaying the map
function initMap() {
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("googleMap"), {
    center: mapCenter,
    zoom: 12
  });
}

// $(document).ready(function() {
//   $('.modal-trigger').leanModal({
//     ready: function() {
//       var map = document.getElementById('googleMap');
//       google.maps.event.trigger(map, 'resize');
//     }
//   });
// });

function getLatLng(e) {
  e.preventDefault();

  var api = "https://maps.googleapis.com/maps/api/geocode/json?address=";
  var zipcode = $("#userZip") // getting the zipcode input
    .val()
    .trim();
  var apiKey = "&key=AIzaSyCLMuYfFilr8RmhGeZEExjIb4HIZAlXd54";

  const queryURL2 = api + zipcode + apiKey;

  // call to API that displays zipcode input on map
  $.ajax({
    url: queryURL2,
    method: "GET"
  }).then(function(response) {
    var lat = response.results[0].geometry.location.lat;
    var lng = response.results[0].geometry.location.lng;

    mapCenter = response.results[0].geometry.location;
    gymLocator(e, lat, lng);
    initMap();
  });
}

function gymLocator(e, lat, lng) {
  e.preventDefault();

  var api2 =
    //try without cors proxy first before sending to github
    corsProxy +
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";

  var searchParameters = "&radius=15000&type=gym";
  var apiKey = "&key=AIzaSyCLMuYfFilr8RmhGeZEExjIb4HIZAlXd54";

  const queryURL3 = api2 + lat + "," + lng + searchParameters + apiKey;
  // console.log(queryURL3);

  // call to API where list of gyms is generated from zipcode input
  $.ajax({
    url: queryURL3,
    method: "GET",
    dataType: "json"
  }).then(function(response2) {
    console.log("list of gyms", response2);

    for (i = 0; i < 10; i++) {
      createMarker(response2.results[i]);

      // using template literal with this list
      // var gym = `<li>
      //               <p>${response2.results[i].name}</p>
      //               <p>${response2.results[i].vicinity}</p>
      //             </li>`;
      // $("#gymList").append(gym);
      // this list shows the gym name and address in another div ^
    }

    // initMap(); <--commented this out because the markers would not appear
  });
}

function createMarker(place) {
  console.log("map2: ", map);

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  // console.log(marker);

  var content = `
  <h5>${place.name}</h5> 
  <p>${place.vicinity}</p> 
  `;
    // using template literal (ES6) ^

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(content);
    infowindow.open(map, this);
  });
}

$('#gymFind').on('click', getLatLng);
