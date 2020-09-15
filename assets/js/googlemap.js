const mapModal = document.querySelector('#googleMap')
const originalMapContent = mapModal.innerHTML

// displaying the map
function initMap (locationLatitude, locationLongitude, gymCoordinates) {
  // Map options
  const options = {
    center: { lat: locationLatitude, lng: locationLongitude },
    zoom: 10
  }

  // New map
  const map = new google.maps.Map(document.getElementById('googleMap'), options)

  // Add markers
  const marker = new google.maps.Marker({
    position: { lat: locationLatitude, lng: locationLongitude },
    map: map
  // icon: '...'
  })

  // const coordinates = gymCoordinates
  for (let i = 0; i < gymCoordinates.length; i++) {
    addMarker(gymCoordinates[i])
  }

  // Add marker function - displays multiple different markers
  function addMarker (loopData) {
    const marker = new google.maps.Marker({
      position: loopData.gym.location,
      map: map,
      icon: 'https://img.icons8.com/offices/2x/map-pin.png'
    })

    // Add infoWindow
    const infoWindowContent = `<h6>${loopData.gym.name}</h6><div>${loopData.gym.address}</div>`
    const infoWindow = new google.maps.InfoWindow({

      content: infoWindowContent
    })

    // Function required to display the info window on map
    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })
  }
}

const apiKey = '&key=AIzaSyCR9kjgT9bBFZyVp5hSkVh_AJGF6VoqcWA'

const searchButton = document.getElementById('gymFind')

searchButton.addEventListener('click', async function (e) {
  e.preventDefault()
  // Displaying the map loading GIF image
  mapModal.innerHTML = '<img style="position: absolute; display:block; top: 50%; transform: translateY(-50%); left: 0; right: 0; margin: auto; width: 30%;" src="./assets/img/loading_image.gif" alt="Your map is on the way!">'

  // getting the zip code input
  const zipCode = document.querySelector('#userZip').value.trim()
  const googleGeocodeAPI = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode},US${apiKey}`

  // call to API to grab latitude and longitude from the zip code user input
  const res = await fetch(googleGeocodeAPI)
    .catch(error => console.error({ error }))

  const data1 = await res.json()
  const googleGeocodeLat = data1.results[0].geometry.location.lat
  const googleGeocodeLng = data1.results[0].geometry.location.lng

  // Google Places API requires Proxy server header to enable cross-origin-resource-sharing (CORS)
  var corsProxy = 'https://cors-anywhere.herokuapp.com/'

  const googlePlacesAPI = `${corsProxy}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${googleGeocodeLat},${googleGeocodeLng}&radius=4500&type=gym&keyword=exercise${apiKey}`

  // call to API where list of gyms is generated using latitude and longitude of zip code
  const res2 = await fetch(googlePlacesAPI)
    .catch(error => console.error({ error }))

  const placesData = await res2.json()

  // Creating new array to hold new gym data objects
  const placesDataLocations = []

  for (let i = 0; i < placesData.results.length; i++) {
    if (placesData.results[i].business_status === 'OPERATIONAL') {
      const gym = {
        location: placesData.results[i].geometry.location,
        name: placesData.results[i].name,
        address: placesData.results[i].vicinity
      }
      placesDataLocations.push({ gym: gym })
    }
  }

  initMap(googleGeocodeLat, googleGeocodeLng, placesDataLocations)
})

// clearing the contents of the map modal on close to prepare for the next query
const modalCloseButton = document.querySelector('#modal-close-button')

modalCloseButton.addEventListener('click', function (e) {
  e.preventDefault()
  // clearing the contents of the zip code search box to prepare for the next query
  document.getElementById('userZip').value = ''
  mapModal.innerHTML = originalMapContent
})
