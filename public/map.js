// map.js

mapboxgl.accessToken = mapToken; // token from your EJS template

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // add a style for the map
  center: listing.geometry.coordinates, // [lng, lat]
  zoom: 9
});

const marker = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);
