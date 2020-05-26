var map;
var directionsService;
var directionsRenderer;
var layers = [];
var markers = {
	0: [],
  1: []
};


function initMap() {
	directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  map = new google.maps.Map(
    document.getElementById("map"), {
    	zoom: 19,
    	center: {lat: 43.62993, lng: 1.37413},
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
  directionsDisplay.setMap(map);
  
	layers[0] = new google.maps.KmlLayer({
	  url: "https://www.google.com/maps/d/u/0/kml?mid=1moc0VilPnQ38VPLZA3TmqzIETDcTT6AZ&lid=QyS-zlkRjMI&ver=" + Date.now(), 
	    preserveViewport: true,
      map: map
	    });
	layers[1] = new google.maps.KmlLayer({
	  url: "https://www.google.com/maps/d/u/0/kml?mid=1moc0VilPnQ38VPLZA3TmqzIETDcTT6AZ&lid=VX516m1cruk&ver=" + Date.now(), 
	    preserveViewport: true
	    });
	      
	var script = document.createElement('script');
  script.src = 'https://lambdafuncgetlocationapi.s3-us-west-2.amazonaws.com/cart_GeoJSONP_updated.js';
  /* script.src = 'https://lambdafuncgetlocationapi.s3-us-west-2.amazonaws.com/cart_GeoJSONP_updated.js'; */
  document.getElementsByTagName('head')[0].appendChild(script);  
}


function getDirection(start, end) {
  var request = {
      origin:start, 
      destination:end,
      travelMode: google.maps.DirectionsTravelMode.WALKING
    };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}


function toggleFloor(i) {
	if(layers[i].getMap() == null) {
    layers[i].setMap(map);
    for (var j = 0; j < markers[i].length; j++) {
      markers[i][j].setMap(map);
    }
  }
  else {
    layers[i].setMap(null);
    for (var j = 0; j < markers[i].length; j++) {
      markers[i][j].setMap(null);
    }
  }
}


function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService.route(
    {
      origin: {query: document.getElementById('start').value},
      destination: {query: document.getElementById('end').value},
      travelMode: 'DRIVING'
    },
    function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}


window.eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var floor = results.features[i].floor
    var latLng = new google.maps.LatLng(coords[0],coords[1]);
    if(floor == 0) {
    	var marker = new google.maps.Marker({
        position: latLng,
        map: map
    	});
      markers[floor].push(marker);
    }
  	var marker = new google.maps.Marker({
        position: latLng,
    });
    markers[floor].push(marker);
  }
}