import moment from 'moment'

import gcClient from '../GcEnvironment'

//updateCheckin(approvalTime: DateTime, approved: Boolean, canceled: Boolean,
// checkinAt: DateTime, checkoutAt: DateTime, description: String, id: ID!,
// rejectionDescription: String, placeId: ID, place: CheckinplacePlace, placeReviewId: ID,
// placeReview: CheckinplaceReviewPlaceReview, userId: ID, userReviewId: ID,
// userReview: CheckinuserReviewUserReview): Checkin

const mutation = `
    mutation SubmitCheckoutMutation(
        $id: ID!,
        $checkoutAt: DateTime,
        $placeReview: CheckinplaceReviewPlaceReview
    ) {
        updateCheckin(
            id: $id,
            checkoutAt: $checkoutAt,
            placeReview: $placeReview
        ) {
            id
        }
    }
`

export default (id,
                description,
                rate,
                placeId,
                userId,
                callback) => {

    const variables = {
        id,
        checkoutAt: moment().toISOString(),
        placeReview: {
            description,
            rate,
            placeId,
            postedById: userId
        },
    }

    // 3
    console.log('\n>>>>>>>>>> Submit checkout update input: ', variables);

    gcClient().then(cli => (cli.request(mutation, variables)))
        .then(() => {
            callback(null, id)
        }, callback)
        .catch(callback)
}