import gcClient from '../GcEnvironment'

const mutation = `
    mutation DeleteUserTechnologyMutation($id: ID!) {
        deleteUserTechnology(id: $id) {
            id
        }
    }
`

export default (id, callback) => {

    const variables = {
        // 1
        id
    }

    console.log('Deleting usertech ' + id)

    gcClient().then(cli => (cli.request(mutation, variables)))
        .then(() => {
            callback(null, id)
        }, callback)
        .catch(callback)
}
