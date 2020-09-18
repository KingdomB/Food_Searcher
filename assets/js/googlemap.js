const mapModal = document.querySelector('#googleMap')
const originalMapContent = mapModal.innerHTML
/* Note: This requires that you consent to location sharing when
   prompted by your browser. If you see the error "Geolocation permission
   denied.", it means you probably did not give permission for the browser * to locate you. */
let pos
let map
let bounds
let infoWindow
let currentInfoWindow
let service

const searchButton = document.getElementById('gymFind')

searchButton.addEventListener('click', function (e) {
  e.preventDefault()
  // Displaying the map loading GIF image
  mapModal.innerHTML = '<img style="position: absolute; display:block; top: 50%; transform: translateY(-50%); left: 0; right: 0; margin: auto; width: 30%;" src="./assets/img/loading_image.gif" alt="Your map is on the way!">'

  function initMap () {
    // Initialize variables
    bounds = new google.maps.LatLngBounds()
    infoWindow = new google.maps.InfoWindow()
    currentInfoWindow = infoWindow

    // Try HTML5 geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        map = new google.maps.Map(document.getElementById('googleMap'), {
          center: pos,
          zoom: 15
        })
        bounds.extend(pos)

        infoWindow.setPosition(pos)
        infoWindow.setContent('Location found.')
        infoWindow.open(map)
        map.setCenter(pos)

        // Call Places Nearby Search on user's location
        getNearbyPlaces(pos)
      }, () => {
        // Browser supports geolocation, but user has denied permission
        handleLocationError(true, infoWindow)
      })
    } else {
      // Browser doesn't support geolocation
      handleLocationError(false, infoWindow)
    }
  }
  initMap()

  // Handle a geolocation error
  function handleLocationError (browserHasGeolocation, infoWindow) {
    // Set default location to Atlanta, Georgia
    pos = { lat: 33.7490, lng: 84.3880 }
    map = new google.maps.Map(document.getElementById('googleMap'), {
      center: pos,
      zoom: 15
    })

    // Display an InfoWindow at the map center
    infoWindow.setPosition(pos)
    infoWindow.setContent(browserHasGeolocation
      ? 'Geolocation permissions denied. Using default location.'
      : 'Error: Your browser doesn\'t support geolocation.')
    infoWindow.open(map)
    currentInfoWindow = infoWindow

    // Call Places Nearby Search on the default location
    getNearbyPlaces(pos)
  }

  // Perform a Places Nearby Search Request
  function getNearbyPlaces (position) {
    const request = {
      location: position,
      rankBy: google.maps.places.RankBy.DISTANCE,
      keyword: 'gym'
    }

    service = new google.maps.places.PlacesService(map)
    service.nearbySearch(request, nearbyCallback)
  }

  // Handle the results (up to 20) of the Nearby Search
  function nearbyCallback (results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMarkers(results)
    }
  }

  // Set markers at the location of each place result
  function createMarkers (places) {
    places.forEach(place => {
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
      })

      google.maps.event.addListener(marker, 'click', () => {
        const request = {
          placeId: place.place_id,
          fields: ['name', 'formatted_address', 'geometry', 'rating',
            'website', 'photos']
        }

        /* Only fetch the details of a place when the user clicks on a marker.
           If we fetch the details for all place results as soon as we get
           the search response, we will hit API rate limits. */
        service.getDetails(request, (placeResult, status) => {
          showDetails(placeResult, marker, status)
        })
      })
      // Adjust the map bounds to include the location of this marker
      bounds.extend(place.geometry.location)
    })
    /* Once all the markers have been placed, adjust the bounds of the map to
       show all the markers within the visible area. */
    map.fitBounds(bounds)
  }

  // Builds an InfoWindow to display details above the marker
  function showDetails (placeResult, marker, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      const placeInfowindow = new google.maps.InfoWindow()
      let rating = 'None'
      if (placeResult.rating) rating = placeResult.rating
      placeInfowindow.setContent('<div><strong>' + placeResult.name + '</strong><br>' + 
      'Rating: ' + rating + '<br>' + 
      placeResult.formatted_address + '<br>' + 
      '<a target="_blank" href=' + placeResult.website + '>Website</a></div>')
      placeInfowindow.open(marker.map, marker)
      currentInfoWindow.close()
      currentInfoWindow = placeInfowindow
    } else {
      console.log('showDetails failed: ' + status)
    }
  }
})

const modalCloseButton = document.querySelector('#modal-close-button')

// clearing the contents of the map modal on close to prepare for the next query
modalCloseButton.addEventListener('click', function (e) {
  e.preventDefault()
  mapModal.innerHTML = originalMapContent
})
