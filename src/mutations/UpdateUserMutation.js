import gcClient from '../GcEnvironment'

import DeleteUserTechnologyMutation from '../mutations/DeleteUserTechnologyMutation'

const mutation = `
    mutation UpdateUserMutation(
        $id: ID!,
        $bio: String,
        $profilePicUrl: String,
        $name: String!,
        $technologies: [UsertechnologiesUserTechnology!]
    ) {
        updateUser(
            id: $id,
            bio: $bio,
            profilePicUrl: $profilePicUrl,
            name: $name,
            technologies: $technologies
        ) {
            id
        }
    }
`

export default (id,
                name,
                bio,
                profilePicUrl,
                technologies,
                oldTechnologies,
                callback) => {

    // Remove old Technologies
    const gcProcess = (oldTechnologies && oldTechnologies.length) ?
        Promise.all(oldTechnologies.map(i => {
            return new Promise((res, rej) => {
                DeleteUserTechnologyMutation(i, (err) => err ? rej(err) : res(true))
            })
        })) : Promise.resolve(true)

    gcProcess.then(() => {
        const variables = {
            id,
            bio,
            profilePicUrl,
            name,
            technologies
        }

        // 3
        console.log('\n>>>>>>>>>> user update input: ', variables);

        gcClient().then(cli => (cli.request(mutation, variables)))
            .then(() => {
                callback(null, id)
            }, callback)
            .catch(callback)
    }, (err) => {
        console.log('>>>>> Error on  deleting promises')
        callback(err)
    });
}