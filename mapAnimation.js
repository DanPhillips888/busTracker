
	var markers = [];
	var map;

//render the map
function init(){
    var myOptions = {
		zoom      : 14,
		center    : { lat:42.353350,lng:-71.091525},
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var element = document.getElementById('map');
  	map = new google.maps.Map(element, myOptions);
  	addMarkers();
}

	//Add a marker to the map
async function addMarkers(){
    // get bus data    
	var locations = await getBusLocations();
	
	//loop thru bus ids and make markers
	locations.forEach(function(bus) {
		var marker = getMarker(bus.id);
		if (marker){
			moveMarker(marker, bus);
		} else {
			addMarker(bus);
		}
	});


	// timer
	console.log(new Date());
	//console.log(markers);
	//console.log(locations);
	setTimeout(addMarkers, 5000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data; //returns live dataset
}

//make a new marker for a bus and add it to the array of markers
function addMarker(bus) {
	var icon = getIcon(bus); //'red.png';
	var marker = new google.maps.Marker({
		position: {
			lat: bus.attributes.latitude,
			lng: bus.attributes.longitude
		},
		map: map,
		icon: icon,
		id: bus.id
	});
	markers.push(marker);
}

function getIcon(bus){
	// select icon based on bus direction
	if (bus.attributes.direction_id === 0) {
		return 'red.png';
	}
	return 'blue.png';	
}

function moveMarker(marker,bus) {
	// change icon if bus has changed direction
	var icon = getIcon(bus);
	marker.setIcon(icon);

	// move icon to new lat/lon
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}

//id a marker for each bus
function getMarker(id) {
	var marker = markers.find(function(item) {
		return item.id === id;
	});
	return marker;
}

window.onload = init;
