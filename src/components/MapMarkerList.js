import React from 'react';
import { View, Text, TouchableHighlight, AsyncStorage } from 'react-native'

import {
    createFragmentContainer,
    graphql
} from 'react-relay'

import {MapView} from 'expo';
import PlaceIcon from './PlaceIcon';
import PlaceModal from './PlaceModal';
import {NavigationActions} from "react-navigation";
import {COLORS, GC_USER_ID} from "../constants";

class MapMarkerList extends React.Component {

    state = {
        modalVisible: null,
        userId: null,
        loading: null
    }

    async componentDidMount() {
        const { placeId } = this.props.navigation.state.params
        console.log('map mounted placeId: ', placeId)
        if(placeId)
            this.setState({modalVisible: placeId})

        this.setState({loading: true})

        const userId = await AsyncStorage.getItem(GC_USER_ID)
        this.setState({userId, loading: false})
    }

    async componentWillReceiveProps(nextProps) {
        const { placeId } = nextProps.navigation.state.params
        console.log('map next props placeId: ', placeId)
        if (placeId !== this.state.modalVisible)
            this.setState({modalVisible: placeId})
    }

    _closeModal = () => {
        const { navigateBack } = this.props.navigation.state.params

        // erase place id from navigation stack
        const setParamsAction = NavigationActions.setParams({
            params: { placeId: null },
            key: 'Map'
        })
        this.props.navigation.dispatch(setParamsAction)

        console.log('\n>>>>> map markerlist navigate back: ', navigateBack)

        if(navigateBack) {
            console.log('\n>>>>> navigating  back .... ')
            console.log(this.props.navigation)

            this.props.navigation.goBack();
        } else {
            this.setState({modalVisible: null})
        }

    }

    _getCheckinPlace = (places) => {
        const { userId } = this.state

        console.log('\n>>>> my maplist userId ', userId)

        const checkedPlaces = places.filter(({node}) => {

            if(node.checkins && node.checkins.edges.length) {

                return node.checkins.edges.filter((checkin) => {

                    const checkinNode = checkin.node

                    return !checkinNode.checkoutAt && !checkinNode.canceled
                        && checkinNode.user.id === userId
                }).length
            }
        })

        // console.log('\n>>>>> checkedplaces', checkedPlaces)

        return checkedPlaces.length ? checkedPlaces[0].node.id : null
    }

    _hasPeopleOnline = (node) => {
        const { userId } = this.state

        console.log('\n>>>> my maplist userId ', userId)


        if(node.checkins && node.checkins.edges.length) {

            return node.checkins.edges.filter((checkin) => {

                const checkinNode = checkin.node

                return !checkinNode.checkoutAt && !checkinNode.canceled
            }).length
        }

        return false
    }

    render() {

        const placesEdges = this.props.viewer.allPlaces.edges

        // const { loading } = this.state
        // if(loading) {
        //     return <View><Text>Please wait...</Text></View>
        // }

        const checkinPlace = this._getCheckinPlace(placesEdges)

        console.log('\n >>>>> My checkin place is ' + checkinPlace)

        return (
            <View>
                {placesEdges.map(({node}, index) => {
                    const hasPeopleOnline = this._hasPeopleOnline(node)

                    return (
                        <MapView.Marker
                            key={node.id}
                            onPress={() => {
                                const setParamsAction = NavigationActions.setParams({
                                    params: { placeId: node.id },
                                    key: 'Map',
                                })
                                this.props.navigation.dispatch(setParamsAction)
                                this.setState({modalVisible: node.id})
                            }}
                            coordinate={{
                                latitude: (node.latitude),
                                longitude: (node.longitude),
                            }}>
                            <View>
                                <TouchableHighlight>
                                    <View style={{
                                        shadowOpacity: 0.75,
                                        shadowRadius: 3,
                                        shadowColor: '#b9b3b3',
                                        shadowOffset: {height: 0, width: 0},
                                        borderRadius: 100,
                                        padding: 5,
                                        borderColor: checkinPlace === node.id ? COLORS.RED :
                                            hasPeopleOnline ? COLORS.GREEN : '#4989fc',
                                        borderWidth: 2,
                                        backgroundColor: '#eaeaea'}}>
                                        <PlaceIcon type={node.type} hasPeopleOnline={hasPeopleOnline}
                                                   checkedIn={checkinPlace === node.id} />
                                    </View>
                                </TouchableHighlight>

                                {this.state.modalVisible === node.id ?
                                    <PlaceModal
                                        navigation={this.props.navigation}
                                        place={node}
                                        checkedIn={checkinPlace}
                                        close={this._closeModal} />
                                    : null}
                            </View>
                        </MapView.Marker>
                    )
                })}
            </View>
        );
    }
}

export default createFragmentContainer(MapMarkerList, graphql`
    fragment MapMarkerList_viewer on Viewer {
        allPlaces(first: $count, orderBy: rooms_DESC)
        @connection(key: "MapMarkerList_allPlaces", filters: []) {
            edges {
                node {
                    id,
                    name,
                    latitude,
                    longitude,
                    description,
                    address,
                    address2,
                    city,
                    state,
                    zip,
                    rooms,
                    needApproval,
                    phone,
                    url,
                    email,
                    schedules {
                        edges {
                            node {
                                id,
                                day,
                                startTime,
                                endTime    
                            }
                        }
                    },
                    images,
                    type {
                        id,
                        name
                    },
                    reviews {
                        edges {
                            node {
                                id,
                                rate,
                                description,
                                postedBy {
                                    id,
                                    name,
                                    email
                                }        
                            }
                        }
                        
                    },
                    checkins(orderBy: checkinAt_DESC,
                        filter: {
                            approvalTime_not: null, 
                            approved: true,
                            OR: [ { canceled: false }, { canceled: null } ]
                        }) {
                        edges {
                            node {
                                id,
                                description,
                                approved,
                                approvalTime,
                                checkinAt,
                                checkoutAt,
                                rejectionDescription,
                                canceled,
                                placeReview {
                                    description,
                                    rate
                                },
                                user {
                                    id,
                                    name,
                                    email,
                                    technologies {
                                        edges {
                                            node {
                                                id,
                                                technology {
                                                    id,
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                                place {
                                    id,
                                    name,
                                    address,
                                    address2,
                                    city,
                                    state,
                                    zip,
                                    postedBy {
                                        name,
                                        email
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`)
