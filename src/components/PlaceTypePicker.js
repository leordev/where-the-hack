import React from 'react'
import {
    QueryRenderer,
    graphql
} from 'react-relay'
import environment from '../Environment'
import PlaceTypePickerList from './PlaceTypePickerList'
import {Text, View} from "react-native";

const PlaceTypePickerQuery = graphql`
    query PlaceTypePickerQuery {
        viewer {
            ...PlaceTypePickerList_viewer
        }
    }
`

export default class PlaceTypePicker extends React.Component {

    render() {
        return (
            <QueryRenderer
                environment={environment}
                query={PlaceTypePickerQuery}
                render={({error, props}) => {
                    if (error) {
                        return <View><Text>{error.message}</Text></View>
                    } else if (props) {
                        return <PlaceTypePickerList {...this.props}
                                                    viewer={props.viewer} />
                    }
                    return <View>
                        <Text>Loading Types...</Text>
                    </View>
                }}
            />
        )
    }

}