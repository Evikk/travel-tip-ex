import { locationService } from './services/location-service.js'

window.onRemoveLocation = onRemoveLocation
window.onGoToLocation = onGoToLocation

var gGoogleMap;

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch((err) => console.log(err));

    goToUserPosition();
    renderLocations()

    document.querySelector('.btn').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);
        panTo(35.6895, 139.6917);
    })
    document.querySelector('.my-location-btn').addEventListener('click', goToUserPosition)
}

function goToUserPosition() {
    getUserPosition()
        .then(pos => {
            console.log('User position is:', pos.coords.latitude, pos.coords.longitude);
            panTo(pos.coords.latitude, pos.coords.longitude)
            addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}


function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gGoogleMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            gGoogleMap.addListener('click', (ev) => {
                const name = prompt('Place name?')
                const currLoc = { id: makeId(), name: name, lat: ev.latLng.lat(), lng: ev.latLng.lng(), createdAt: Date.now(), updatedAt: Date.now() }
                locationService.saveToUserLocations(currLoc)
                renderLocations()
            })

        })
}


// const geocoder = new google.maps.Geocoder();
// const infowindow = new google.maps.InfoWindow();
// document.getElementById("submit").addEventListener("click", () => {
//   geocodePlaceId(geocoder, map, infowindow);
// });


function renderLocations() {
    locationService.getLocations().then(locs => {
        console.log(...locs, locs);
        const strHtmls = locs.map((loc) => {
            return `<tr>
                    <td>${loc.id}</td>
                    <td>${loc.name}</td>
                    <td>${loc.lat}</td>
                    <td>${loc.lng}</td>
                    <td>${new Date (loc.createdAt)}</td>
                    <td>${new Date (loc.updatedAt)}</td>
                    <td><button onclick="onGoToLocation('${loc.lat}','${loc.lng}')">Go to location</button></td>
                    <td><button onclick="onRemoveLocation('${loc.id}')">Delete</button></td>
                </tr>`
        })
        document.querySelector('table tbody').innerHTML = strHtmls.join('')
    })
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gGoogleMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gGoogleMap.panTo(laLatLng);
}

function getUserPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
        // const API_KEY = 'AIzaSyDI6__u8gXVVI6E3ZGXIs703qEqfaHxJ1g';  // evyatar
    const API_KEY = 'AIzaSyDb64W3a2V2JyNpij6IvG4V34JCLnEnzfc'; // daniel
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

// function _connectGeocodeApi(){
//     if (window.google) return Promise.resolve()
//     const API_KEY = 'AIzaSyDb64W3a2V2JyNpij6IvG4V34JCLnEnzfc'; // daniel
//     var elGoogleApi = document.createElement('script');
//     elGoogleApi.src = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${API_KEY}`;

//     elGoogleApi.async = true;
//     document.body.append(elGoogleApi);

//     return new Promise((resolve, reject) => {
//         elGoogleApi.onload = resolve;
//         elGoogleApi.onerror = () => reject('Google script failed to load')
//     })
// }




function doConfirm(msg) {
    const res = confirm(msg)
    return Promise.resolve(res);
}

function makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}

function onRemoveLocation(id) {
    console.log('id', id)
    doConfirm('Really, delete all?')
        .then(userDecision => {
            if (userDecision) {
                locationService.removeLocation(id).then(res => console.log(res))
            }
        })
    renderLocations()

}

function onGoToLocation(lat, lng) {
    panTo(lat, lng)
    addMarker({ lat: Number(lat), lng: Number(lng) })
}

function copyUrlLink() {

    const myParam = urlParams.get('myParam');
    // const urlParams = new URLSearchParams(window.location.search);
    const urlParams = new URLSearchParams({
        lat: glat,
        lng: glng
    });


}