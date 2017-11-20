import React, { Component } from 'react'
import {
    QueryRenderer,
    graphql
} from 'react-relay'
import environment from '../Environment'
import {Text, View} from "react-native";
import Profile from "./Profile";

export const ProfilePageQuery = graphql`
    query ProfilePageQuery(
        $filter: UserFilter!
    ) {
        viewer {
            ...Profile_viewer
        }
    }
`

class ProfilePage extends Component {

    render() {
        return (
            <QueryRenderer
                environment={environment}
                query={ProfilePageQuery}
                variables={{
                    filter: {id: this.props.navigation.state.params.userId},
                }}
                render={({error, props}) => {
                    if (error) {
                        return <View><Text>{error.message}</Text></View>
                    } else if (props) {
                        return <Profile viewer={props.viewer} navigation={this.props.navigation} />
                    }
                    return <View>
                        <Text>Loading Profile...</Text>
                    </View>
                }}
            />
        )
    }

}

export default ProfilePage