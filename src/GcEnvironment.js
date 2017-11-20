import {GC_AUTH_TOKEN} from "./constants";
import {AsyncStorage} from "react-native";
import { GraphQLClient } from 'graphql-request'

const GC_API = 'https://api.graph.cool/simple/v1/cja4t4ape1por0169768el8i4' //'https://api.graph.cool/simple/v1/cj9n8511g0gok0158gbb8o8j3';

export default () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(GC_AUTH_TOKEN, (err, token) => {
            if(err) {
                return reject(err)
            }

            console.log('\n >>>>> GcToken: ' + token);

            resolve(new GraphQLClient(GC_API, {
                headers: {
                    Authorization: 'Bearer ' + (token || ''),
                },
            }))
        });
    })
}