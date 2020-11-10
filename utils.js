function mungeLocation(location) {
  return {
    latitude: location.lat,
    longitude: location.lon,
    display_name: location.display_name,

  }; 
}

function mungeWeather(location) {
  return {
    latitude: location.lat,
    longitude: location.lon,
    display_name: location.display_name,
  
  }; 
}

function mungeTrails(location) {
  return {
    latitude: location.lat,
    longitude: location.lon,
    display_name: location.display_name,
  
  }; 
}
  
function mungeReviews(location) {
  return {
    latitude: location.lat,
    longitude: location.lon,
    display_name: location.display_name,
  
  }; 
}
  
  
module.exports = {
  mungeLocation, mungeWeather, mungeTrails, mungeReviews
}; 

