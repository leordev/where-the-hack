import React from 'react';
import {Button, AsyncStorage, Text, View} from 'react-native';
import { NavigationActions } from 'react-navigation'
import {MapView} from 'expo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GC_AUTH_TOKEN, GC_USER_ID, LATITUDE_DELTA, LONGITUDE_DELTA} from "../constants";

import Header from './Header';
import MapMarkerListContainer from './MapMarkerListContainer'

const sheniRegion = {
    latitude: 26.0338825,
    longitude: -80.1766484,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
}

const concreteBeachRegion = {
    latitude: 25.8002793,
    longitude: -80.2030799,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
}

// https://stackoverflow.com/questions/43176862/get-current-location-latitude-and-longitude-in-reactnative-using-react-native-m

export default class Map extends React.Component {

    static navigationOptions = {
        drawerLabel: 'Explore Places to Hack',
        drawerLockMode: 'locked-closed',
        drawerIcon: ({ tintColor }) => (
            <MaterialIcons
                name="map"
                size={24}
                style={{ color: tintColor }}
            />
        ),
    };

    _logout = () => {
        console.log('logout user');
        AsyncStorage.multiRemove([GC_USER_ID, GC_AUTH_TOKEN], () => {
            console.log('logged out user');
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Login'})
                ]
            })
            this.props.navigation.dispatch(resetAction)
        });

    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    componentDidMount() {
        const vm = this;

        console.log('component map mounted');

        // We can only set the function after the component has been initialized
        this.props.navigation.setParams({ handleLogout: this._logout });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('current position: ' + position);
                vm.setState({currentRegion: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }});
            },
            (error) => {
                console.log('error while asking geolocation: ', error)
                alert(error.message)
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );

        // this.watchID = navigator.geolocation.watchPosition((position) => {
        //     console.log('watching position: ' + position);
        //     this.onRegionChange(position)
        // })
    }

    state = {
        currentRegion: concreteBeachRegion
    }

    onRegionChange = (position) => {
        this.setState({currentRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }});
    }

    render() {
        const { currentRegion } = this.state

        const { navigateBack } = this.props.navigation.state.params

        return (
            <View style={{flex: 1}}>
                <Header
                    navigateBack={navigateBack}
                    navigation={this.props.navigation}
                    title={"Work Spots"} />
                <MapView
                    style={{flex: 1}}
                    showsUserLocation = {true}
                    initialRegion={currentRegion}>
                    <MapMarkerListContainer
                        navigation={this.props.navigation}
                        longitude={currentRegion.longitude}
                        latitude={currentRegion.latitude} />
                </MapView>
            </View>

        );
    }
}


