import React, { Component } from 'react'
import {
    QueryRenderer,
    graphql
} from 'react-relay'
import environment from '../Environment'
import MapMarkerList from './MapMarkerList'
import { MAX_MARKERS_ON_SCREEN } from '../constants'
import {Text, View} from "react-native";

const MapMarkerListContainerQuery = graphql`
    query MapMarkerListContainerQuery(
        $count: Int!
    ) {
        viewer {
            ...MapMarkerList_viewer
        }
    }
`

class MapMarkerListContainer extends Component {

    render() {
        return (
            <QueryRenderer
                environment={environment}
                query={MapMarkerListContainerQuery}
                variables={{
                    count: MAX_MARKERS_ON_SCREEN,
                }}
                render={({error, props}) => {
                    if (error) {
                        return <View><Text>{error.message}</Text></View>
                    } else if (props) {
                        return <MapMarkerList {...this.props} viewer={props.viewer} />
                    }
                    return null;
                }}
            />
        )
    }

}

export default MapMarkerListContainer