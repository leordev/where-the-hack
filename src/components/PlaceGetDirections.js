import Communications from "react-native-communications";

const isValidLatLong = (num, range) => typeof num === 'number' && num <= range && num >= -1 * range

const isValidCoordinates = coords =>
    isValidLatLong(coords.latitude, 90) && isValidLatLong(coords.longitude, 180)

const getParameterString = (params = []) => {
    return params
        .map(({key, value}) => {
            const encodedKey = encodeURIComponent(key)
            const encodedValue = encodeURIComponent(value)

            return `${encodedKey}=${encodedValue}`
        })
        .join('&')
}

const getDirections = (destination, params = [
        {
            key: "dirflg",
            value: "d"
        }
    ]) => {

    if (destination && isValidCoordinates(destination)) {
        params.push({
            key: 'daddr',
            value: `${destination.latitude},${destination.longitude}`
        })
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            if (position && position.coords && isValidCoordinates(position.coords)) {
                params.push({
                    key: 'saddr',
                    value: `${position.coords.latitude},${position.coords.longitude}`
                })
            } else {
                alert('Could not get your location, please enter manually')
            }

            const url = `http://maps.google.com/maps?${getParameterString(params)}`
            console.log('\n>>>>> Get Directions URL: ', url);
            return Communications.web(url)
        },
        (error) => {
            console.log(error)
            alert('Could not get your location, please enter manually')

            const url = `http://maps.google.com/maps?${getParameterString(params)}`
            return Communications.web(url)
        },
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000}
    );
}

export default getDirections