import moment from 'moment'

import gcClient from '../GcEnvironment'

const mutation = `
    mutation UpdateCheckinMutation(
        $id: ID!,
        $approved: Boolean,
        $approvalTime: DateTime,
        $canceled: Boolean,
        $checkoutAt: DateTime,
        $rejectionDescription: String
    ) {
        updateCheckin(
            id: $id,
            approved: $approved,
            approvalTime: $approvalTime,
            canceled: $canceled,
            checkoutAt: $checkoutAt,
            rejectionDescription: $rejectionDescription
        ) {
            id
        }
    }
`

export default (id,
                approved,
                approvalTime,
                canceled,
                checkoutAt,
                rejectionDescription,
                callback) => {

    const variables = {
        id,
        approved,
        approvalTime,
        canceled,
        checkoutAt,
        rejectionDescription,
    }

    // 3
    console.log('\n>>>>>>>>>> checkin update input: ', variables);

    gcClient().then(cli => (cli.request(mutation, variables)))
        .then(() => {
            callback(null, id)
        }, callback)
        .catch(callback)
}