import gcClient from '../GcEnvironment'

import moment from 'moment'

const mutation = `
    mutation CreateCheckinMutation(
        $approved: Boolean!,
        $approvalTime: DateTime,
        $checkinAt: DateTime!,
        $description: String,
        $placeId: ID!,
        $userId: ID!
    ) {
        createCheckin(
            approved: $approved,
            approvalTime: $approvalTime,
            checkinAt: $checkinAt,
            description: $description,
            placeId: $placeId,
            userId: $userId
        ) {
            id
        }
    }
`

export default (approved,
                description,
                placeId,
                userId,
                callback) => {

    const approvalTime = approved ?
        moment().toISOString()
        : null

    const checkinAt = moment().toISOString()

    if(!placeId || !userId)
        return callback('User and Place are required to create a CheckIn')

    const variables = {
        approved,
        approvalTime,
        checkinAt,
        description,
        placeId,
        userId,
    }

    // 3
    gcClient().then(cli => (cli.request(mutation, variables)))
        .then(data => {
            callback(null, {...variables, id: data.createCheckin.id})
        }, callback)
        .catch(callback)
}