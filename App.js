import React from 'react';

import { StyleSheet, Platform, StatusBar } from 'react-native';
import {
    DrawerNavigator,
} from 'react-navigation';

import Map from './src/components/Map'
import ProfilePage from './src/components/ProfilePage'
import Signup from './src/components/Signup'
import SideMenu from './src/components/SideMenu'
import PlaceNew from './src/components/PlaceNew'
import CheckinHeaderHandler from './src/components/CheckinHeaderHandler'

export default DrawerNavigator({
        Signup: {screen: Signup},
        Profile: { screen: ProfilePage },
        Map: { screen: Map },
        Checkins: { screen: CheckinHeaderHandler },
        PlaceNew: { screen: PlaceNew },
    },
    {
        contentComponent: SideMenu,
        drawerWidth: 240,
        cardStyle: {
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
        }
    });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
