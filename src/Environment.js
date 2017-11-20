import { AsyncStorage } from 'react-native'
import {GC_AUTH_TOKEN} from "./constants";

import { SubscriptionClient } from 'subscriptions-transport-ws'

const URL = 'https://api.graph.cool/relay/v1/cja4t4ape1por0169768el8i4' //https://api.graph.cool/relay/v1/cj9n8511g0gok0158gbb8o8j3
const SURL = 'wss://subscriptions.graph.cool/v1/cja4t4ape1por0169768el8i4' //wss://subscriptions.graph.cool/v1/cj9n8511g0gok0158gbb8o8j3

// 1
const {
    Environment,
    Network,
    RecordSource,
    Store,
} = require('relay-runtime')

// 2
const store = new Store(new RecordSource())

const fetchQuery = (operation, variables) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(GC_AUTH_TOKEN, (err, res) => {
            if(err) {
                console.log('Environment getting token error: ' + err);
            }

            resolve(res || null);
        });
    }).then((res) => {
        return fetch(URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${res || ''}`
            },
            body: JSON.stringify({
                query: operation.text,
                variables,
            }),
        })
    }).then(response => {
        return response.json()
    });
}

const setupSubscription = (config, variables, cacheConfig, observer) => {
    const query = config.text

    const subscriptionClient = new SubscriptionClient(SURL, {reconnect: true})
    subscriptionClient.subscribe({query, variables}, (error, result) => {
        observer.onNext({data: result})
    })
}

// 3
const network = Network.create(fetchQuery, setupSubscription)

// 5
const environment = new Environment({
    network,
    store,
})

// 6
export default environment