import gcClient from '../GcEnvironment'

const mutation = `
    mutation SigninUserMutation($email: String!, $password: String!) {
        emailAuthenticateUser(email: $email, password: $password) {
            token
            id
        }
    }
`

export default (email, password, callback) => {
    const variables = {
        email,
        password
    }

    gcClient().then(cli => (cli.request(mutation, variables)))
        .then(data => {
            console.log('\n>>>>> Simple Client Signin data ', data)
            const id = data.emailAuthenticateUser.id
            const token = data.emailAuthenticateUser.token
            callback(null, id, token)
        }, callback)
        .catch(callback)
}