import gcClient from '../GcEnvironment'

const mutation = `
    mutation CreateUserMutation($name: String!,
        $email: String!,
        $password: String!) {
        
        signupUser(email: $email, password: $password, name: $name) {
            id
            token
          }
    }
`

export default (name, email, password, callback) => {
    const variables = {
        // 1
        name,
        email,
        password
    }

    // 3
    gcClient().then(cli => (cli.request(mutation, variables)))
        .then(data => {
            console.log('\n>>>>> Simple Client Signin data ', data)
            const id = data.signupUser.id
            const token = data.signupUser.token
            callback(null, id, token)
        }, callback)
        .catch(callback)
}