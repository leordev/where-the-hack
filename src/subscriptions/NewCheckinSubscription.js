import {
    graphql,
    requestSubscription
} from 'react-relay'

import {AsyncStorage} from 'react-native'

const {ConnectionHandler} = require('relay-runtime');

import environment from '../Environment'
import {GC_USER_ID} from "../constants";

const newCheckinSubscription = graphql`
    subscription NewCheckinSubscription {
        #1
        Checkin {
            #2
            node {
                id
                canceled
                description
                checkinAt
                checkoutAt
                approved
                rejectionDescription
                approvalTime
                user {
                    id
                    email
                    name
                    profilePicUrl
                }
                place {
                    id
                    name
                    latitude
                    longitude
                    address
                    address2
                    city
                    state
                    zip
                    phone
                    email
                    url
                    type {
                        id
                        name
                    }
                    postedBy {
                        name,
                        email
                    }
                }
            }
        }
    }
`

export default () => {
    const subscriptionConfig = {
        subscription: newCheckinSubscription,
        variables: {},
        updater: async (proxyStore, data) => {
            console.log('\n>>>>> New checkin subscription detected')

            const createCheckinField = proxyStore.getRootField('Checkin')
            const newCheckin = createCheckinField.getLinkedRecord('node')
            const newCheckinId = newCheckin.getValue('id');
            const newCheckinDescription = newCheckin.getValue('description');
            const newCheckinCheckinAt = newCheckin.getValue('checkinAt');
            const newCheckinCheckoutAt = newCheckin.getValue('checkoutAt');
            const checkinUser = newCheckin.getLinkedRecord('user')
            const checkinUserId = checkinUser.getValue('id');
            const checkinUserEmail = checkinUser.getValue('email');
            const checkinUserName = checkinUser.getValue('name');
            const checkinPlace = newCheckin.getLinkedRecord('place')
            const checkinPlaceId = checkinPlace.getValue('id');
            const checkinPlaceName = checkinPlace.getValue('name')

            console.log('\n>>>>> Checkin:', newCheckinId, newCheckinDescription,
                newCheckinCheckinAt, newCheckinCheckoutAt);
            console.log('\n>>>>> Checkin User:', checkinUserEmail,
                checkinUserName);
            console.log('\n>>>>> Checkin Place:', checkinPlaceId, checkinPlaceName);

            const viewer = proxyStore.getRoot().getLinkedRecord('viewer');

            // // Update Checkin List
            // const checkins = ConnectionHandler.getConnection(viewer,
            //     'CheckinHeaderViewer_allCheckins');
            // const edges = checkins.getLinkedRecords('edges');
            //
            // console.log('\n>>>> Checkin Edges length: ' + edges.length)
            // const hasCheckin = edges && edges.filter(i => {
            //     const cc = i.getLinkedRecord('node');
            //     console.log('\n>>>>> Analyzing checkin ' + cc.getValue('id'));
            //     return newCheckinId === cc.getValue('id');
            // }).length
            //
            // if (!hasCheckin) {
            //     console.log('\n>>>>> Its a Brand New Checkin!');
            //
            //     const currentUserId = await AsyncStorage.getItem(GC_USER_ID);
            //
            //     console.log('\n>>>>> Current User ID vs Checkin User ID: ' +
            //         currentUserId + " / " + checkinUserId)
            //
            //     if (currentUserId === checkinUserId) {
            //         const edge = ConnectionHandler.createEdge(
            //             proxyStore,
            //             checkins,
            //             newCheckin,
            //             'Checkin',
            //         );
            //         ConnectionHandler.insertEdgeBefore(checkins, edge);
            //
            //         console.log('\n>>>>> New checkin appended before');
            //     } else {
            //         console.log('\n>>>>> nevermind... another user checkin');
            //     }
            //
            // }
        },
        onError: error => console.error(`\n>>>>> An error occurred in Checkin Subscription:`, error)
    }

    requestSubscription(
        environment,
        subscriptionConfig
    )
}