import React from 'react';
import { DrawerItems } from 'react-navigation';
import {StyleSheet, Text, View, AsyncStorage, TouchableOpacity, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, GC_AUTH_TOKEN, GC_USER_ID} from "../constants";
import { AppLoading, Font } from 'expo';

import {NavigationActions} from 'react-navigation';

import Communications from 'react-native-communications';
import {createRefetchContainer, QueryRenderer} from "react-relay";
import environment from "../Environment";
import moment from "moment";
import NewCheckinSubscription from "../subscriptions/NewCheckinSubscription";

class SideMenu extends React.Component {

    state = {loaded: false, checkinSubscription: null}

    async componentDidMount() {
        console.log('sidemenu mounted >>>>> ', this.props.userId);

        this.props.relay.refetch({filter: {id: this.props.userId}}, null,
            (res) => this.setState({loaded: true}))
    }

    componentWillReceiveProps(newProps) {
        if (newProps.userId !== this.props.userId) {
            this.setState({loaded: false})
            this.props.relay.refetch({filter: {id: newProps.userId}}, null,
                (res) => this.setState({loaded: true}))
        }

        if (newProps.userId) {
            this.setState({checkinSubscription: NewCheckinSubscription()})
        } else {
            this.setState({checkinSubscription: null})
        }

    }

    navigateToScreen = (route, params) => () => {
        console.log('navigating to ' + route)
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params
        });
        this.props.navigation.dispatch(navigateAction);
    }

    _editProfile = async () => {
        const id = this.props.userId
        console.log('going to profile ' + id)
        this.navigateToScreen('Profile', {userId: id, navigateBack: false})()
    }

    render() {
        if(!this.state.loaded)
            return <AppLoading/>;

        const user = this.props.viewer.allUsers.edges[0].node;

        const pendingCheckin = user.checkins.edges.map(i => i.node)
            .find(node => (!node.approved && !node.approvalTime && !node.canceled) || // pending check-in
            (node.approved && !node.checkoutAt && !node.canceled) // running check-in
        )

        return (
            <View>
                <TouchableOpacity
                    style={{
                        marginLeft: -10,
                        marginTop: 80,
                        alignItems: 'center',}}
                    onPress={this._editProfile}>
                    <View
                        style={{
                            borderWidth: 2,
                            borderColor:'#6C9CF2',
                            width:80,
                            height:80,
                            borderRadius:40,
                            marginLeft: -8,
                        }}>
                        <Image
                            source={user.profilePicUrl ?
                                {uri: user.profilePicUrl} :
                                require('../../assets/images/user.png')}
                            style={{
                                height: 74,
                                width: 74,
                                marginTop: 1,
                                marginLeft: 1,
                                borderRadius: 37}}/>
                    </View>
                    <Text
                        style={{
                            fontFamily: 'space-mono',
                            fontSize: 18,
                            marginTop: 10,
                            marginBottom: 25,
                        }}>{user.name}</Text>
                </TouchableOpacity>

                { pendingCheckin ? <TouchableOpacity style={{alignItems: 'center',
                    justifyContent:'center', marginBottom: 15}}
                                onPress={this.navigateToScreen('Checkins')}>
                    <Text style={{fontFamily: 'space-mono',
                        fontSize: 18,
                        color: '#6c9cf2' }}>Working</Text>
                    <Text style={{fontFamily: 'space-mono',
                        fontSize: 18,
                        color: '#6c9cf2' }}>at {pendingCheckin.place.name}</Text>
                    <Text style={{fontFamily: 'space-mono',
                        fontSize: 18,
                        color: '#6c9cf2' }}>
                        for {moment.duration(moment()
                        .diff(pendingCheckin.approvalTime)).humanize()}
                    </Text>
                </TouchableOpacity> :
                    <TouchableOpacity
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: 75,
                            paddingLeft: 15,
                            alignItems: 'center',
                        }}
                        onPress={this.navigateToScreen('Checkins')}>
                        <MaterialIcons
                            style={{paddingRight: 10,marginTop: 1, color: '#494949'}}
                            name="book"
                            size={24}
                        />
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: 'space-mono',
                            }}>My Last Hacks</Text>
                    </TouchableOpacity> }

                <View style={{
                    width: 200,
                    height: 1,
                    backgroundColor: '#E1E1E1',
                    alignSelf: 'flex-end'
                }}></View>
                <TouchableOpacity 
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: 75,
                        paddingLeft: 15,
                        alignItems: 'center',
                    }}
                    onPress={this.navigateToScreen('Map')}>
                    <MaterialIcons
                        style={{paddingRight: 10,marginTop: 1, color: '#494949'}}
                        name="map"
                        size={24}
                    />
                    <Text 
                        style={{
                            fontSize: 18,
                            fontFamily: 'space-mono',
                    }}>Find Places</Text>
                </TouchableOpacity>
                <View style={{
                    width: 200,
                    height: 1,
                    backgroundColor: '#E1E1E1',
                    alignSelf: 'flex-end'
                }}></View>
                <TouchableOpacity
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: 75,
                        paddingLeft: 15,
                        alignItems: 'center',
                    }}
                    onPress={this.navigateToScreen('PlaceNew')}>
                    <MaterialIcons
                        style={{paddingRight: 10,marginTop: 1, color: '#494949'}}
                            name="add-location"
                            size={24} />
                    <Text 
                        style={{
                            fontFamily: 'space-mono',
                            fontSize: 18,
                        }}
                        >Add a New Place</Text>
                </TouchableOpacity>
                <View style={{
                    width: 200,
                    height: 1,
                    backgroundColor: '#E1E1E1',
                    alignSelf: 'flex-end'
                }}></View>
                <TouchableOpacity
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: 75,
                        paddingLeft: 15,
                        alignItems: 'center',
                    }}
                    onPress={() => Communications.email(['leordev@gmail.com'], null, null,
                        '[WHERETHEHACK-Support] ', 'Hey Leo, \n\nI need help with the app. This is ' +
                        'what\'s happening: \n\n')}>
                    <MaterialIcons
                        style={{paddingRight: 10,marginTop: 1, color: '#494949'}}
                            name="help"
                            size={24} />
                    <Text
                        style={{
                            fontFamily: 'space-mono',
                            fontSize: 18,
                        }}>Support</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const SideMenuContainer = createRefetchContainer(
    SideMenu,
    {
        viewer: graphql`
            fragment SideMenu_viewer on Viewer {
                allUsers(filter: $filter, first: 1)
                @connection(key: "SideMenu_allUsers") {
                    edges {
                        node {
                            id,
                            name,
                            profilePicUrl
                            checkins(orderBy: checkinAt_DESC,
                                filter: {
                                    checkoutAt_not: null,
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
        `
    },
    graphql`
        query SideMenuUserQuery($filter: UserFilter!) {
            viewer {
                ...SideMenu_viewer
            }
        }
    `,
);

const SideMenuUserQuery = graphql`
    query SideMenuUserQuery($filter: UserFilter!) {
        viewer {
            ...SideMenu_viewer
        }
    }
`

export default class SideMenuFinal extends React.Component {
    state = {
        userId: null
    }

    async componentDidMount() {
        // await Font.loadAsync({
        //     'open-sans': require('../../assets/fonts/Open_Sans/OpenSans-Regular.ttf'),
        //     'open-sans-semi': require('../../assets/fonts/Open_Sans/OpenSans-Bold.ttf'),
        //     'open-sans-bold': require('../../assets/fonts/Open_Sans/OpenSans-SemiBold.ttf'),
        //     'space-mono': require('../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf'),
        //     'space-mono-bold': require('../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf')
        // });

        const userId = await AsyncStorage.getItem(GC_USER_ID);

        this.setState({userId})
    }


    async componentWillReceiveProps(nextProps) {
        const userId = await AsyncStorage.getItem(GC_USER_ID);

        this.setState({userId})
    }

    render() {

        const userId = this.state.userId

        console.log('Sidemenu reading userId >>>>> ', userId)

        return userId ?
            <QueryRenderer
                environment={environment}
                query={SideMenuUserQuery}
                variables={{
                    filter: {id: userId},
                }}
                render={({error, props}) => {
                    if (error) {
                        return <View><Text>{error.message}</Text></View>
                    } else if (props) {
                        return <SideMenuContainer viewer={props.viewer}
                                                  userId={userId}
                                                  navigation={this.props.navigation} />
                    }
                    return <View>
                        <Text>Loading Profile...</Text>
                    </View>
                }}
            /> : <AppLoading />

    }

}