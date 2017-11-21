import React from 'react'
import {Text, TouchableOpacity, View} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Communications from "react-native-communications";
import {TYPE_HOMEOFFICE} from "../constants";
import PlaceGetDirections from "./PlaceGetDirections";

export default class PlaceAddressContact extends React.Component {
    render () {
        const { place } = this.props

        return (
            <View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 18}}>
                    <View>
                        <Text style={{
                            fontFamily: 'space-mono-bold',
                            color: '#666666',
                            fontSize: 14}}>ADDRESS</Text>
                        <Text style={{
                            color: '#4E4E4E',
                            fontFamily: 'open-sans',
                            fontSize: 18}}>{place.address}</Text>
                        {place.address2 ? <Text style={{color: '#4E4E4E',fontSize: 18}}>{place.address2}</Text> : null}
                        <Text style={{color: '#4E4E4E',fontSize: 18}}>{place.city}, {place.state} {place.zip}</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            backgroundColor: '#4989fc',
                            alignSelf: 'center',
                            marginVertical: 18,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            shadowOpacity: 0.75,
                            shadowRadius: 5,
                            shadowColor: '#b9b3b3',
                            shadowOffset: {height: 0, width: 0}}}
                        onPress={() => PlaceGetDirections({
                            latitude: place.latitude,
                            longitude: place.longitude})}>
                        <MaterialIcons
                            style={{
                                color: 'white',
                                marginRight: 8,
                                marginTop: 0,
                            }}
                            name="map"
                            size={17}
                        />
                        <Text style={{
                            color: 'white',
                            fontFamily: 'open-sans-bold',
                            fontSize: 12}}>DIRECTIONS</Text>
                    </TouchableOpacity>
                </View>

                { place.email || place.phone || place.url ?
                    <View style={{marginTop: 25}}>
                        <Text style={{
                            fontFamily: 'space-mono-bold',
                            color: '#666666',
                            fontSize: 14,
                        }}>CONTACT</Text>

                        { this.props.showOwner && place.type.id === TYPE_HOMEOFFICE ?
                            <View>
                                <View style={{flexDirection: 'column',paddingVertical: 2,}}>
                                    <View style={{
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'}}>
                                        <Text style={{
                                            color: '#4E4E4E',
                                            fontFamily: 'open-sans',
                                            fontSize: 18}}>
                                            {place.postedBy.name}
                                        </Text>
                                    </View>
                                    <View style={{
                                        marginTop: 6,
                                        marginBottom: 2,
                                        backgroundColor: '#99bdfd',
                                        height: 1,
                                        width: '10%',
                                    }}></View>
                                </View>

                                <View style={{flexDirection: 'column',paddingVertical: 2,}}>
                                    <View style={{
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'}}>
                                        <Text style={{
                                            color: '#4E4E4E',
                                            fontFamily: 'open-sans',
                                            fontSize: 18}}>
                                            {place.postedBy.email.substring(0,25)}
                                        </Text>
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 4,
                                                backgroundColor: '#4989fc',
                                                paddingVertical: 6,
                                                paddingHorizontal: 10,
                                                shadowOpacity: 0.75,
                                                shadowRadius: 5,
                                                shadowColor: '#b9b3b3',
                                                shadowOffset: {height: 0, width: 0}}}
                                            onPress={() => Communications.email([place.postedBy.email], null, null,
                                                '[WHERETHEHACK] Place Contact ', '')}>
                                            <MaterialIcons
                                                style={{
                                                    color: 'white',
                                                    marginRight: 6}}
                                                name="email"
                                                size={14} />
                                            <Text style={{
                                                color: 'white',
                                                fontFamily: 'open-sans-bold',
                                                fontSize: 12}}>EMAIL</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{
                                        marginTop: 6,
                                        marginBottom: 2,
                                        backgroundColor: '#99bdfd',
                                        height: 1,
                                        width: '10%',
                                    }}></View>
                                </View>
                            </View> : null
                        }

                        { place.phone ?
                            <View style={{flexDirection: 'column',paddingVertical: 2,}}>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'}}>
                                    <Text style={{
                                        color: '#4E4E4E',
                                        fontFamily: 'open-sans',
                                        fontSize: 18}}>{place.phone}</Text>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginBottom: 4,
                                            backgroundColor: '#4989fc',
                                            paddingVertical: 6,
                                            paddingHorizontal: 10,
                                            shadowOpacity: 0.75,
                                            shadowRadius: 5,
                                            shadowColor: '#b9b3b3',
                                            shadowOffset: {height: 0, width: 0}}}
                                        onPress={() => Communications.phonecall(place.phone, true)}>
                                        <MaterialIcons
                                                style={{
                                                    marginRight: 6,
                                                    marginTop: 3,
                                                    color: 'white'}}
                                                name="phone"
                                                size={16} />
                                        <Text style={{
                                            color: 'white',
                                            fontFamily: 'open-sans-bold',
                                            fontSize: 12}}>CALL</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    marginTop: 6,
                                    marginBottom: 2,
                                    backgroundColor: '#99bdfd',
                                    height: 1,
                                    width: '10%',
                                }}></View>
                            </View> : null }

                        { place.email ?
                            <View style={{flexDirection: 'column',paddingVertical: 2,}}>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'}}>
                                    <Text style={{
                                        color: '#4E4E4E',
                                        fontSize: 18}}>
                                        {place.email.substring(0,25)}
                                    </Text>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginBottom: 4,
                                            backgroundColor: '#4989fc',
                                            paddingVertical: 6,
                                            paddingHorizontal: 10,
                                            shadowOpacity: 0.75,
                                            shadowRadius: 5,
                                            shadowColor: '#b9b3b3',
                                            shadowOffset: {height: 0, width: 0}}}
                                        /*onPress={() => Communications.email([place.email], null, null,
                                            '[WHERETHEHACK] Place Contact ', '') */>
                                            <MaterialIcons
                                                style={{
                                                    color: 'white',
                                                    marginRight: 6}}
                                                name="email"
                                                size={14} />
                                            <Text style={{
                                                color: 'white',
                                                fontFamily: 'open-sans-bold',
                                                fontSize: 12}}>EMAIL</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    marginTop: 6,
                                    marginBottom: 2,
                                    backgroundColor: '#99bdfd',
                                    height: 1,
                                    width: '10%',
                                }}></View>
                            </View> : null }

                        { place.url ?
                            <View style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: 2,}}>
                                <Text style={{
                                    color: '#4E4E4E',
                                    fontSize: 18}}>
                                    {place.url.replace('http://', '')
                                        .replace('https://', '')
                                        .replace('www.', '')
                                        .substring(0,25)}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: 34,
                                        backgroundColor: '#4989fc',
                                        paddingHorizontal: 8,
                                        shadowOpacity: 0.75,
                                        shadowRadius: 5,
                                        shadowColor: '#b9b3b3',
                                        shadowOffset: {height: 0, width: 0}}}
                                    onPress={() => {
                                        const url = place.url.indexOf('http') >= 0 ?
                                            place.url : 'http://' + place.url;
                                        console.log('>>>>> ' + url)
                                        Communications.web(url)
                                    }}>
                                    <MaterialIcons
                                        style={{
                                            color: 'white',
                                            marginRight: 6,}}
                                        name="language"
                                        size={15} />
                                    <Text style={{
                                        color: 'white',
                                        fontFamily: 'open-sans-bold',
                                        fontSize: 12}}>VISIT SITE</Text>
                                </TouchableOpacity>
                            </View> : null }
                    </View> : null }
            </View>
        )
    }
}