import gcClient from '../GcEnvironment'

const mutation = `
    mutation SigninFacebookMutation($token: String!) {
        facebookAuthenticateUser(facebookToken: $token) {
            token
            id
        }
    }
`

export default (token, callback) => {
    const variables = {
        token
    }

    gcClient().then(cli => (cli.request(mutation, variables)))
        .then(data => {
            console.log('\n>>>>> Facebook Signin data ', data)
            const id = data.facebookAuthenticateUser.id
            const token = data.facebookAuthenticateUser.token
            callback(null, id, token)
        }, callback)
        .catch(callback)
}