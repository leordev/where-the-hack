import gcClient from '../GcEnvironment'

const mutation = `
    mutation CreatePlaceMutation(
        $address: String!,
        $address2: String,
        $city: String!,
        $country: String!,
        $description: String!,
        $latitude: Float!,
        $longitude: Float!,
        $name: String!,
        $needApproval: Boolean!,
        $rooms: Int!,
        $state: String!,
        $zip: String!,
        $phone: String,
        $url: String,
        $postedById: ID!,
        $typeId: ID!,
        $schedules: [PlaceschedulesPlaceSchedule!],
        $images: [String!],
    ) {
        createPlace(
            address: $address,
            address2: $address2,
            city: $city,
            country: $country,
            description: $description,
            latitude: $latitude,
            longitude: $longitude,
            name: $name,
            needApproval: $needApproval,
            rooms: $rooms,
            state: $state,
            zip: $zip,
            phone: $phone,
            url: $url,
            postedById: $postedById,
            typeId: $typeId,
            schedules: $schedules,
            images: $images
        ) {
            id
        }
    }
`

export default (address,
                address2,
                city,
                country,
                description,
                latitude,
                longitude,
                name,
                needApproval,
                rooms,
                state,
                zip,
                phone,
                url,
                postedById,
                typeId,
                scheduleList,
                images,
                callback) => {

    let hasScheduleError = null;
    const schedules = scheduleList.map(item => {
        const obj = {
            day: item.day,
            startTime: item.startTime,
            endTime: item.endTime,
        }

        if(!obj.day || !obj.startTime || !obj.endTime) {
            hasScheduleError = 'Schedule day, start time and end time must be filled';
        }

        if(obj.startTime.length !== 5 || obj.endTime.length !== 5) {
            hasScheduleError = 'Time format must be 00:00, from 00:00 to 23:59';
        }

        return obj;
    })

    if(hasScheduleError)
        return callback(hasScheduleError)

    const variables = {
        address,
        address2,
        city,
        country,
        description,
        latitude,
        longitude,
        name,
        needApproval,
        rooms,
        state,
        zip,
        phone,
        url,
        postedById,
        typeId,
        schedules,
        images
    }

    // 3
    gcClient().then(cli => (cli.request(mutation, variables)))
        .then(data => {
            callback(null, {...variables, id: data.createPlace.id})
        }, callback)
        .catch(callback)
}