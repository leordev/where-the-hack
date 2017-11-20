import React from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Modal, Text, View, AsyncStorage, ScrollView, Button, Alert, TouchableOpacity, TextInput, Dimensions} from "react-native";
import Header from "./Header";
import moment from 'moment';

import * as Animatable from 'react-native-animatable';

import {
    QueryRenderer,
    graphql, createFragmentContainer, createRefetchContainer
} from "react-relay";
import environment from '../Environment'
import CheckinList from "./CheckinList";
import PopupDialog, {DialogButton, DialogTitle} from "react-native-popup-dialog";

import {COLORS, GC_USER_ID, LATE_CANCEL_MINS} from "../constants";
import UpdateCheckinMutation from "../mutations/UpdateCheckinMutation";
import SubmitCheckoutMutation from "../mutations/SubmitCheckoutMutation";
import PlaceAddressContact from "./PlaceAddressContact";

const CheckinHeaderHandlerQuery = graphql`
    query CheckinHeaderHandlerQuery(
        $filter: CheckinFilter!
    ) {
        viewer {
            ...CheckinHeaderHandler_viewer
        }
    }
`

const queryFilter = (userId, places) => {
    const filterArray = [ { user: {id: userId } } ]
        .concat((places || []).map(i => ({place: { id: i}}))); // TODO: Get place Ids

    return {
        OR: filterArray
    }
}

class CheckinHeaderViewer extends React.Component {

    state = {
        checkinModal: false,
        waiting: false,
        checkoutModal: false,
        checkin: null
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.openCheckin &&
            nextProps.openCheckin !== this.props.openCheckin) {
            this._reloadCheckins(true)
            this.setState({checkinModal: true})
        }
    }

    _reloadCheckins = (openModal) => {

        const checkinModal = openModal || this.state.checkinModal

        this.setState({waiting: true});
        this.props.relay.refetch({filter: queryFilter(this.props.userId)}, null, (res) => {
            this.setState({waiting: false, checkinModal});
        });
    }

    _submitCheckout = (checkin) => {
        const { checkoutText, checkoutRate } = this.state

        this.setState({waiting: false})
        SubmitCheckoutMutation(checkin.id,
            checkoutText,
            checkoutRate,
            checkin.place.id,
            checkin.user.id, ((err) => {
                this.setState({waiting: false})
                if(err) {
                    console.log('\n>>>>> Error Submitting Check-OUT: ', err);
                    alert('An error has occurred while Submitting the Check-OUT: ' + err)
                } else {
                    this._reloadCheckins();
                }
            }))
    }

    _doCancelCheckin = (checkin) => {
        this.setState({waiting: true})

        UpdateCheckinMutation(checkin.id, checkin.approved, checkin.approvalTime, true,
            checkin.checkoutAt, null, ((err) => {
            this.setState({waiting: false})
            if(err) {
                console.log('\n>>>>> Error CANCELING Check-In: ', err);
                alert('An error has occurred while CANCELING the Check-In: ' + err)
            } else {
                this._reloadCheckins();
            }
        }))
    }

    _cancelCheckin = (checkin) => {

        const lateCancel = moment().diff(checkin.approvalTime) > (LATE_CANCEL_MINS * 60 * 1000);

        const cancelText = lateCancel ? 'Looks like your Check-In was approved more than' +
            ' 20 minutes ago. Our team would contact you to investigate what happened.' : '';

        const checkinReq = { ...checkin, checkoutAt: lateCancel ? moment().toISOString() : null }

        Alert.alert(
            'Cancel Check-In',
            cancelText + 'Are you sure that you want to cancel the current Check-In?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this._doCancelCheckin(checkinReq)},
            ],
            { cancelable: false }
        )
    }

    _renderLasts = (checkins) => {

        return (
            <View>
                <Header navigation={this.props.navigation} title={'My Last Hacks'} />

                <ScrollView style={{padding: 16, height: '100%', flexDirection: 'column'}}>
                    <CheckinList displayPlace={true} displayUser={false}
                                 checkins={checkins} />
                </ScrollView>
            </View>

        )

    }

    _renderCheckoutModal = (checkin) => {

        const popupWidth = (Dimensions.get('window')).width - 20;

        const { checkoutText, checkoutRate } = this.state

        return (
            <PopupDialog
                width={popupWidth}
                height={380}
                dialogTitle={<DialogTitle title={'Check-Out Submission'} />}
                show={true}
                actions={[
                    <DialogButton
                        text="Cancel"
                        align={'center'}
                        onPress={() => {
                            this.setState({checkoutModal: false});
                            this.checkoutDialog.dismiss();
                        }}
                        key="checkout-dialog-cancel"
                    />
                ]}
                ref={(checkoutDialog) => { this.checkoutDialog = checkoutDialog; }}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                    <Text>Check-out from {checkin.place.name}</Text>

                    <Text style={{fontWeight: '700', marginTop: 30}}>Rate this HACK</Text>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => this.setState({checkoutRate: 1})}>
                            <MaterialIcons
                                style={{marginLeft: 6, color: checkoutRate >= 1 ? COLORS.ORANGE : null}}
                                name={checkoutRate >= 1 ? 'star' : 'star-border' }
                                size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({checkoutRate: 2})}>
                            <MaterialIcons
                                style={{marginLeft: 6, color: checkoutRate >= 2 ? COLORS.ORANGE : null}}
                                name={checkoutRate >= 2 ? 'star' : 'star-border' }
                                size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({checkoutRate: 3})}>
                            <MaterialIcons
                                style={{marginLeft: 6, color: checkoutRate >= 3 ? COLORS.ORANGE : null}}
                                name={checkoutRate >= 3 ? 'star' : 'star-border' }
                                size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({checkoutRate: 4})}>
                            <MaterialIcons
                                style={{marginLeft: 6, color: checkoutRate >= 4 ? COLORS.ORANGE : null}}
                                name={checkoutRate >= 4 ? 'star' : 'star-border' }
                                size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({checkoutRate: 5})}>
                            <MaterialIcons
                                style={{marginLeft: 6, color: checkoutRate >= 5 ? COLORS.ORANGE : null}}
                                name={checkoutRate >= 5 ? 'star' : 'star-border' }
                                size={20} />
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop: 20,
                        borderWidth: 1,
                        width: '90%',
                        borderColor: COLORS.BLUE}}>
                        <TextInput multiline={true}
                                   numberOfLines={4}
                                   style={{fontSize: 18, height: 80}}
                                   onChangeText={(text) => this.setState({checkoutText: text})}
                                   value={checkoutText} />
                    </View>

                    <Button
                        title="Submit Check-Out"
                        onPress={() => this._submitCheckout(checkin)} />
                </View>
            </PopupDialog>
        )
    }

    _renderPending = (checkin) => {
        const { place } = checkin

        return <View style={{flex:1}}>
            <Header navigation={this.props.navigation} title={'Current Hacking'} />

            <View style={{backgroundColor: '#fff', flex: 10, justifyContent: 'space-between',
                alignItems: 'center', padding: 0}}>
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 25}}>
                    <Text style={{fontFamily: 'open-sans'}}>You are {checkin.approved ? `working` : `waiting for an Approval`} at</Text>
                    <Text style={{fontFamily: 'open-sans-bold', fontSize: 40,
                        fontWeight: '700'}}>{checkin.place.name}</Text>
                </View>


                <View style={{width: '95%'}}>
                    <PlaceAddressContact place={place}
                                         showOwner={true} />
                </View>

                { checkin.approved ? <Text style={{marginTop: 25, marginBottom: 25, fontFamily: 'open-sans'}}>
                        You started this HACK {moment(checkin.approvalTime).fromNow()}
                    </Text> :
                    <Text style={{marginTop: 25, marginBottom: 25, fontFamily: 'open-sans'}}>
                        You submitted this request
                        {` ${moment.duration(moment().diff(checkin.checkinAt)).humanize()} `}
                        ago
                    </Text> }


                {!checkin.approved || moment().diff(checkin.approvalTime) <
                LATE_CANCEL_MINS * 60 * 1000 ?
                    <TouchableOpacity onPress={() => this._cancelCheckin(checkin)}>
                        <Text style={{color: COLORS.RED, fontSize: 20}}>
                            {this.state.waiting ? 'Please Wait...' : 'Cancel Check-In'}
                        </Text>
                    </TouchableOpacity> :
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            paddingVertical: 15,
                            backgroundColor: COLORS.RED}}
                        onPress={() => this.setState({checkoutModal: true,
                            checkoutText: 'It was AWESOME!', checkoutRate: 5 })}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 20,
                            fontFamily: 'space-mono-bold',
                            color: 'white'}}>
                            {this.state.waiting ? 'Please Wait...' : 'Submit Check-Out'}
                        </Text>
                    </TouchableOpacity>
                }

                { this.state.checkoutModal ? this._renderCheckoutModal(checkin) : null }
            </View>
        </View>
    }

    render() {

        const { checkinModal, waiting } = this.state

        const checkins = this.props.viewer.allCheckins.edges.map(({node}) => node);

        const pendingCheckin = checkins.find(i =>
            (!i.approved && !i.approvalTime && !i.canceled) || // pending check-in
            (i.approved && !i.checkoutAt && !i.canceled) // running check-in
        )

        // this.setState({checkin: pendingCheckin})

        return (
            <View style={{flex: 1, height: '100%', width: '100%'}}>
                { pendingCheckin ? this._renderPending(pendingCheckin) : this._renderLasts(checkins)}
            </View>
        )
    }
}

const CheckinHeaderViewerFragment = createRefetchContainer(CheckinHeaderViewer,
    { viewer: graphql`
        fragment CheckinHeaderHandler_viewer on Viewer {
            allCheckins(filter: $filter, first: 100, orderBy: checkinAt_DESC)
            @connection(key: "CheckinHeaderViewer_allCheckins", filters: []) {
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
                            email
                        },
                        place {
                            id,
                            name,
                            address,
                            address2,
                            city,
                            state,
                            zip,
                            phone,
                            email,
                            url,
                            latitude,
                            longitude,
                            type {
                                id
                                name
                            }
                            postedBy {
                                name,
                                email
                            }
                        }
                    }
                }
            }
        }
    `},
    graphql`
        query CheckinHeaderHandlerQuery(
            $filter: CheckinFilter!
        ) {
            viewer {
                ...CheckinHeaderHandler_viewer
            }
        }
    `
)

export default class CheckinHeaderHandler extends React.Component {

    state = {
        ready: false,
        userId: null
    }

    async componentDidMount() {
        const userId = await AsyncStorage.getItem(GC_USER_ID);
        this.setState({ready: true, userId})
    }

    _loadingRender = () => {
        return <Animatable.View
            animation="rotate"
            duration={1000}
            easing="linear"
            iterationCount="infinite">
            <MaterialIcons
                name={"refresh"}
                size={32}
                style={{marginRight: 15,
                    marginLeft: 15}} />
        </Animatable.View>
    }

    render() {

        const { ready, userId } = this.state

        const filter = queryFilter(userId);

        return (
            ready ?
            <QueryRenderer
                environment={environment}
                query={CheckinHeaderHandlerQuery}
                variables={{filter}}
                render={({error, props}) => {
                    if (error) {
                        alert('Fail to Synchronize Check-Ins: ' + error.message);
                    } else if (props) {
                        return <CheckinHeaderViewerFragment {...this.props}
                                                            userId={userId}
                                                            viewer={props.viewer} />
                    }
                    return this._loadingRender()
                }}
            /> : this._loadingRender()
        )
    }
}