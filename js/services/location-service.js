import {storageService} from './storage-service.js'

export const locationService = {
    getLocations,
    saveToUserLocations,
    removeLocation
}
const STORAGE_KEY = 'locations'
const gLocations = [];


// console.log(storageService.loadFromStorage(STORAGE_KEY));

if (storageService.loadFromStorage(STORAGE_KEY).length > 0){
    gLocations.push(...storageService.loadFromStorage(STORAGE_KEY))
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

