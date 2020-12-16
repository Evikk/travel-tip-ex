import {storageService} from './storage-service.js'

export const locationService = {
    getLocations,
    saveToUserLocations,
    getAddress,
    getLocationByAddress,
    removeLocation
}
const STORAGE_KEY = 'locations'
const gLocations = [];


// console.log(storageService.loadFromStorage(STORAGE_KEY));

if (storageService.loadFromStorage(STORAGE_KEY) && storageService.loadFromStorage(STORAGE_KEY).length > 0){
    gLocations.push(...storageService.loadFromStorage(STORAGE_KEY))
}

function getAddress(address) {
    console.log(address);
    const API_KEY = 'AIzaSyDb64W3a2V2JyNpij6IvG4V34JCLnEnzfc'
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then((res) => res.json())
        .catch((err) => { console.log('Had issues:', err) })
}

function getLocationByAddress(lat,lng) {
    console.log(lat,lng);
    const API_KEY = 'AIzaSyDb64W3a2V2JyNpij6IvG4V34JCLnEnzfc'
    return fetch(` https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
        .then((res) => res.json())
        .catch((err) => { console.log('Had issues:', err) })
}

function getLocations() {
    return Promise.resolve(gLocations)
}

function saveToUserLocations(location) {    
    gLocations.push(location)
    _saveLocationsToStorage()
}

function removeLocation(id){
    return new Promise((resolve, reject) => {
    var locIdx = gLocations.findIndex(function (loc) {
        return id === loc.id
    })
    gLocations.splice(locIdx, 1)
    _saveLocationsToStorage();
    return resolve('deleted!')
    })
}

function _saveLocationsToStorage(){
    storageService.saveToStorage(STORAGE_KEY, gLocations)
}

