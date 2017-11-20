import React from 'react';
import {
    StyleSheet, AsyncStorage,
    Text, TextInput, View, Button, Alert,
    ScrollView, Switch, TouchableOpacity, Image
} from 'react-native';
import {ImagePicker} from 'expo';

import {
    AWS_S3_ACCESS_KEY, AWS_S3_BUCKET, AWS_S3_PLACE_PICS, AWS_S3_REGION, AWS_S3_SECRET_KEY, COLORS,
    GC_USER_ID
} from '../constants'
import Header from './Header';
import PlaceTypePicker from "./PlaceTypePicker";
import CreatePlaceMutation from "../mutations/CreatePlaceMutation";
import main from '../styles/main'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {FieldInput} from "./FieldInput";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {RNS3} from "react-native-aws3";
const uuidv4 = require('uuid/v4');

const BRAND_NEW_PLACE = {
    id: null,
    name: null,
    description: null,
    latitude: null,
    longitude: null,
    address: null,
    address2: null,
    city: null,
    state: null,
    zip: null,
    country: 'US',
    needApproval: false,
    rooms: '3',
    phone: null,
    email: null,
    url: null,
    typeId: null,
    schedules: [],
    images: []
}

export default class PlaceNew extends React.Component {

    static navigationOptions = {
        title: 'Enter a New Place'
    };

    state = {
        place: {
            ...BRAND_NEW_PLACE,
        },
        wait: false,
        addressPicked: null
    }

    _setPlaceState = (field, value) => {
        const { place } = this.state
        place[field] = value
        console.log('changing new place field [' +
        field + '] to "' + value + '"')
        this.setState({place})
    }

    _doPickImage = async (useCamera) => {
        const pickerFunction = useCamera ? ImagePicker.launchCameraAsync :
            ImagePicker.launchImageLibraryAsync;

        let result = await pickerFunction({
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.cancelled) {
            const place = { ...this.state.place }
            place.images = place.images.concat(result.uri);
            this.setState({ place });
        }
    }

    _pickImage = () => {
        Alert.alert('Edit Profile Picture',
            'Do you want to take a picture now from your camera or just select one from your gallery?',
            [
                {text: 'Camera', onPress: () => this._doPickImage(true)},
                {text: 'Gallery', onPress: () => this._doPickImage(false)},
            ],
            { cancelable: false }
        )
    };

    _removeImage = (index) => {
        const place = { ...this.state.place }
        place.images = place.images.filter((i, counter) => index !== counter);
        this.setState({ place });
    }

    _uploadImages = async (images) => {

        const options = {
            keyPrefix: AWS_S3_PLACE_PICS,
            bucket: AWS_S3_BUCKET,
            region: AWS_S3_REGION,
            accessKey: AWS_S3_ACCESS_KEY,
            secretKey: AWS_S3_SECRET_KEY,
            successActionStatus: 201
        }

        const reqs = images.map((img, index) => {
            const file = {
                uri: img,
                name: uuidv4() + ".jpg",
                type: "image/jpeg"
            }

            return RNS3.put(file, options).then(res => {
                if(res.status !== 201) {
                    console.log('\n>>>>> Fail to upload profile pic to S3', index, res);
                    alert('Fail to upload place picture ' + index + ', please try again later');
                    return;
                }

                return 'https://' + options.bucket + '.s3.amazonaws.com/' +
                    options.keyPrefix + file.name;
            });
        });

        const urls = (await Promise.all(reqs)).filter(i => !!i);

        return urls;

    }

    _submitPlace = async () => {
        if(this.state.wait)
            return;

        const { name,
            description,
            latitude,
            longitude,
            address,
            address2,
            city,
            state,
            zip,
            country,
            needApproval,
            rooms,
            phone,
            url,
            typeId,
            schedules,
            images
        } = this.state.place

        console.log('Submitting new place', JSON.stringify(this.state.place));

        if(!name ||
            !description ||
            !latitude ||
            !longitude ||
            !address ||
            !city ||
            !state ||
            !zip ||
            !rooms ||
            !typeId) {
            return alert('there are missing required fields');
        }

        if(!images.length) {
            return alert('please submit at least one image');
        }

        const postedById = await AsyncStorage.getItem(GC_USER_ID);

        this.setState({wait: true});

        const uploadedImages = await this._uploadImages(images)

        CreatePlaceMutation(address,
            address2,
            city,
            country,
            description,
            Number(latitude),
            Number(longitude),
            name,
            needApproval,
            Number(rooms),
            state,
            zip,
            phone,
            url,
            postedById,
            typeId,
            schedules,
            uploadedImages,
            (err, newPlace) => {
                this.setState({wait: false});
                if(err) {
                    console.log(err);
                    if(err.source && err.source.errors && err.source.errors.length) {
                        const errMsg = err.source.errors[0].message;
                        alert('An error has occurred on the place creation request: ' +
                            errMsg);
                    } else {
                        alert(err);
                    }
                    return;
                }

                console.log('New place was created: ' + newPlace.id);

                alert(newPlace.name + ' was created successfully');

                this.props.navigation.navigate('Map', {place: newPlace})
            })

    }

    _handleAddressPick = (data, details) => {
        console.log('\n>>>>> Address Picker data: ', data)
        // console.log('\n>>>>> Address Picker Details: ', details)


        let place = { ...this.state.place }

        const location = details && details.geometry && details.geometry.location
        if(!location) {
            return alert('Fail to select this place.');
        }

        place.latitude = location.lat;
        place.longitude = location.lng;
        place.url = details.website;
        place.phone = details.formatted_phone_number;
        place.name = details.name;

        console.log(details.address_components)

        details.address_components.forEach(addr => {
            if(addr.types.indexOf("country") >= 0)
                return place.country = addr.short_name;

            if(addr.types.indexOf("postal_code") >= 0)
                return place.zip = addr.short_name;

            if(addr.types.indexOf("administrative_area_level_1") >= 0)
                return place.state = addr.short_name;

            if(addr.types.indexOf("locality") >= 0)
                return place.city = addr.short_name;

            if(addr.types.indexOf("route") >= 0)
                return place.address = place.address ? place.address + " " + addr.short_name :
                    addr.short_name;

            if(addr.types.indexOf("street_number") >= 0)
                return place.address = place.address ? addr.short_name + " " + place.address :
                    addr.short_name;
        })

        this.setState({place, addressPicked: true})
    }

    _renderAutocomplete = () => {
        return <GooglePlacesAutocomplete
            placeholder='Search your place'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed='auto'  // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={this._handleAddressPick}
            getDefaultValue={() => ''}
            query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyDS7LBjeCK30j_6lwJb-QBasrLJJ1K-o98',
                language: 'en', // language of the results
                //types: 'geocode' // default: 'geocode'
            }}

            styles={{
                textInputContainer: {
                    width: '100%'
                },
                description: {
                    fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                    color: '#1faadb'
                }
            }}

            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance'
            }}

            filterReverseGeocodingByTypes={[]}
            predefinedPlaces={[]}
            debounce={200}
        />
    }

    _renderAddressForm = () => {

        const { place } = this.state

        return <View>

            <View>
                <Text style={{fontWeight: '700', marginTop: 20}}>Address:</Text>
                <Text>{place.address}</Text>
                <Text>{place.city}, {place.state} {place.zip}</Text>
                <TouchableOpacity
                    style={{margin: 8}}
                    onPress={() => this.setState({addressPicked: false, place: BRAND_NEW_PLACE})}>
                    <Text style={{textAlign: 'center', fontWeight: '700', color: COLORS.RED}}>
                        Reselect Address
                    </Text>
                </TouchableOpacity>
            </View>

            <FieldInput label="Complimentary Address (optional)"
                        readOnly={false}
                        onChange={(text) => this._setPlaceState('address2', text)}
                        value={place.address2} />

            <FieldInput label="Name of the Place *"
                        readOnly={false}
                        onChange={(text) => this._setPlaceState('name', text)}
                        value={place.name} />

            <FieldInput label="Description *"
                        readOnly={false}
                        onChange={(text) => this._setPlaceState('description', text)}
                        value={place.description} />

            <FieldInput label="Phone"
                        readOnly={false}
                        onChange={(text) => this._setPlaceState('phone', text)}
                        value={place.phone} />

            <FieldInput label="Website URL"
                        readOnly={false}
                        onChange={(text) => this._setPlaceState('url', text)}
                        value={place.url} />

            {/*<Text*/}
                {/*style={main.inputLabel}>Need Aproval? *</Text>*/}
            {/*<Switch*/}
                {/*onValueChange={(val) => this._setPlaceState('needApproval', val)}*/}
                {/*value={place.needApproval}*/}
            {/*/>*/}

            <Text
                style={main.inputLabel}>Available Seats*</Text>
            <TextInput
                keyboardType={`numeric`}
                style={main.inputField}
                onChangeText={(text) => this._setPlaceState('rooms', text)}
                value={place.rooms}
            />

            <Text style={main.inputLabel}>Place Pictures*</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: COLORS.RED}}>
                    You must submit at least one
                </Text>
                <TouchableOpacity onPress={this._pickImage}
                    style={{ backgroundColor: COLORS.BLUE,
                        borderRadius: 3, padding: 6}}>
                    <Text style={{color: '#fff'}}>Add Image</Text>
                </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', padding: 5}}>
                {place.images.map((i,index) => <TouchableOpacity key={index} onPress={() => this._removeImage(index)}>
                    <Image source={{uri: i}}
                        style={{height: 60, width: 80, marginRight: 5, marginTop: 2 }} />
                    <MaterialIcons
                        name={'remove-circle-outline'}
                        size={20}
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            position: 'absolute',
                            right: 10,
                            bottom: 5}} />
                </TouchableOpacity>)}
            </View>

        </View>
    }

    render() {

        const { addressPicked, place } = this.state

        return (
            <View style={{flex:1,}}>
            <ScrollView style={{
                backgroundColor: '#f7f7f7',
                display: 'flex',
                width: '100%',}}>
                <Header
                    navigation={this.props.navigation}
                    style = {{width: '100%'}}
                    title={"Add a New Place"} />

                <View
                    style={{
                        paddingHorizontal: '5%',
                        paddingBottom: 90,
                    }}>

                    <Text
                        style={main.inputLabel}>Type of the Place *</Text>
                    <PlaceTypePicker
                        value={place.typeId}
                        onValueChange={(itemValue, itemIndex) => this._setPlaceState("typeId", itemValue)} />

                    {place.typeId ?
                        (addressPicked ? this._renderAddressForm() :
                        this._renderAutocomplete()):
                        null}
                </View>
                </ScrollView>

                <TouchableOpacity
                    style={main.bottomPrimaryButton}
                    onPress={this._submitPlace} >
                    <Text style={main.primaryButtonText}>
                        {this.state.wait ? 'Please wait...' : 'Submit' }
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
