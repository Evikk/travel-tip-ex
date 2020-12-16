

export const locationService = {
    getLocations,
    saveToUserLocations
}


const  gLocations = [];

function getLocations() {
    return Promise.resolve(gLocations)
}

function saveToUserLocations(location) {    
    gLocations.push(location)
}