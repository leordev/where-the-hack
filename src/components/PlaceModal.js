import React from "react";
import {View, Text, Modal, Button, TextInput, ScrollView, TouchableOpacity, Image} from 'react-native'
import Header from './Header';
import PlaceIcon from "./PlaceIcon";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, TYPE_HOMEOFFICE} from "../constants";
import CheckInDialog from "./CheckInDialog";
import CheckinList from "./CheckinList";
import PlaceAddressContact from "./PlaceAddressContact";


import ImageGallery, { openImageGallery } from '@expo/react-native-image-gallery';

class PlaceModal extends React.Component {

    state = {
        displayCheckinModal: false,
        showCheckIn: false,
        tempCheckIn: false,
        openCheckIn: false
    }

    _verifyCheckin = (res) => {
        this.setState({showCheckIn: false,
            tempCheckIn: !!res,
            openCheckIn: !!res
        })

        if (!!res) {
            this.props.navigation.navigate('Checkins')
        }
    }

    render() {
        const {place} = this.props

        const hackers = (place.checkins &&
            place.checkins.edges.filter(({node}) => node.approved &&
                !node.canceled && !node.checkoutAt).length) || 0

        const isFull = hackers >= place.rooms

        const images = place.images && place.images.length && place.images.map(i => ({
            description: place.name,
            imageUrl: i
        }))

        return (<Modal
                animationType="slide"
                transparent={false}
                visible={true}
                onRequestClose={this.props.close}>
            <View style={{flex: 1}}>
                <Header
                    style={{height: 400,width: 400}}
                    backButton={this.props.close}
                    title={place.name} >
                    <Text>{place.type}</Text>
                </Header>

                <ScrollView style={{backgroundColor: 'white'}}>

                <View style={{paddingHorizontal: '5%'}}>
                    { place.images && place.images.length ?
                        <ScrollView style={{
                                        marginTop: 10,
                                        height: 130}}
                                    contentContainerStyle={{justifyContent: 'center'}}
                                    horizontal={true} >
                            {images
                                .map((img, index) => (
                                <TouchableOpacity 
                                    style={{marginRight: 10,}}
                                    key={index}
                                    onPress={() => {
                                        this._view.measure((rx, ry, w, h, x, y) => {
                                            openImageGallery({
                                                animationMeasurements: {w, h, x, y},
                                                list: images,
                                                item: img,
                                            });
                                        });
                                    }}>
                                    <Image source={{uri: img.imageUrl}}
                                           ref={view => { this._view = view }}
                                           style={{
                                                height: 120,
                                                width: 160,
                                                marginTop: 0,
                                            }} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView> : null }

                    <Text style={{
                        color:'#4E4E4E',
                        fontFamily:'open-sans',
                        marginTop: 4,
                        fontSize: 16}}>{place.description}</Text>

                    <PlaceAddressContact place={place}
                                         showOwner={false} />

                    {place.checkins.edges.length ?
                        <View>
                        <CheckinList displayPlace={false} displayUser={true} displayHackersCounter={true}
                                     navigation={this.props.navigation}
                                     checkins={place.checkins.edges.map(({node}) => node)} /></View> :
                        <Text style={{marginTop: 15}}>OOoops... Looks like nobody hacked at this place. BE THE FIRST! :)</Text>
                    }
                </View>

                <ImageGallery />
            </ScrollView>

                {this.state.tempCheckIn ?
                    <View>
                        <Text style={{color: 'white'}}>
                            Please Wait... Processing Check-In...
                        </Text>
                    </View>: !this.state.showCheckIn ?
                    <TouchableOpacity
                        style={{
                            paddingVertical: 15,
                            backgroundColor: isFull ? COLORS.RED : '#4989fc'}}
                        onPress={() => !isFull && this.setState({showCheckIn: true})}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 20,
                            fontFamily: 'space-mono-bold',
                            color: 'white'}}>
                            {isFull ? 'PLACE IS FULL' : 'RESERVE YOUR SPOT'}
                        </Text>
                    </TouchableOpacity> : null }
            </View>

            <CheckInDialog show={this.state.showCheckIn}
                           close={this._verifyCheckin}
                           place={place} />
        </Modal>)
    }
}

export default PlaceModal