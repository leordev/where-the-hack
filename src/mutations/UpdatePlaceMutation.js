import moment from 'moment'

import gcClient from '../GcEnvironment'

const mutation = `
    mutation UpdatePlaceInput(
        $id: ID!,
        $name: String!,
        $description: String!,
        $phone: String,
        $url: String,
        $email: String,
        $rooms: Int!,
        $images: [String!]
    ) {
        updatePlace(
            id: $id,
            name: $name,
            description: $description,
            phone: $phone,
            url: $url,
            email: $email,
            rooms: $rooms,
            images: $images
        ) {
            id
        }
    }
`

export default (id,
                name,
                description,
                phone,
                url,
                email,
                rooms,
                images,
                callback) => {

    const variables = {
        id,
        name,
        description,
        phone,
        url,
        email,
        rooms,
        images
    }

    // 3
    console.log('\n>>>>> place update input: ', variables);

    gcClient().then(cli => (cli.request(mutation, variables)))
        .then(() => {
            callback(null, id)
        }, callback)
        .catch(callback)
}