import React from 'react';
import {AsyncStorage, Button, Image, ScrollView, StyleSheet, Alert,
    Text, TouchableOpacity, View} from 'react-native';
import {createRefetchContainer} from "react-relay";
import Header from "./Header";
import {FieldInput} from "./FieldInput";
import {ImagePicker} from 'expo';
import {
    AWS_S3_ACCESS_KEY, AWS_S3_BUCKET, AWS_S3_PROFILE_PICS, AWS_S3_REGION, AWS_S3_SECRET_KEY, COLORS, GC_AUTH_TOKEN,
    GC_USER_ID
} from "../constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { RNS3 } from 'react-native-aws3';
const uuidv4 = require('uuid/v4');

import {NavigationActions} from 'react-navigation';

import UpdateUserMutation from '../mutations/UpdateUserMutation'
import TechnologiesBlock from "./TechnologiesBlock";
import CheckinList from "./CheckinList";
import main from "../styles/main";

class Profile extends React.Component {

    static navigationOptions = {
        title: 'Profile'};

    state = {
        canEdit: false,
        userForm: null,
        profilePic: null,
        edit: false,
        text: "testing",
        technologies: [],
        technologiesToRemove: [],
        wait: false
    }

    componentDidMount() {
        AsyncStorage.getItem(GC_USER_ID, (err,res) => {
            const user = this.props.viewer.allUsers.edges[0].node;
            const technologies = [].concat(user.technologies.edges.map(i => i.node));

            if (res === user.id)
                this.setState({canEdit: true});

            this._reloadTechs()
        })
    }

    navigateToScreen = (route, params) => () => {
        console.log('navigating to ' + route)
        const navigateAction = NavigationActions.navigate({
            routeName: route,
            params
        });
        this.props.navigation.dispatch(navigateAction);
    }

    _logout = async () => {
        console.log('logout user');
        await AsyncStorage.multiRemove([GC_USER_ID, GC_AUTH_TOKEN]);

        console.log('logged out user');
        this.navigateToScreen('Signup', {userId: null})();
    }

    _reloadTechs = () => {
        const user = this.props.viewer.allUsers.edges[0].node;
        const technologies = [].concat(user.technologies.edges.map(i => i.node));

        this.setState({technologies});
    }

    _addTech = (t) => {
        const { technologies } = this.state
        this.setState({technologies: technologies.concat({id: null, technology: t})},
            () => {
                console.log('Current Tech: ', t)
                console.log('Techs: ', this.state.technologies)
                console.log('Techs to Remove: ', this.state.technologiesToRemove)
            })
    }

    _removeTech = (t) => {
        const { technologiesToRemove, technologies } = this.state

        const technologiesAdjusted = technologies.filter(i => i !== t);

        const technologiesRemoved = t.id ? technologiesToRemove.concat(t) : technologiesToRemove;

        this.setState({
            technologiesToRemove: technologiesRemoved,
            technologies: technologiesAdjusted
        }, () => {
            console.log('Current Tech: ', t)
            console.log('Techs: ', this.state.technologies)
            console.log('Techs to Remove: ', this.state.technologiesToRemove)
        })
    }

    _setUserField = (field, val) => {
        const { userForm } = this.state

        userForm[field] = val;

        this.setState({userForm})
    }

    _submitProfile = async () => {

        const { userForm, technologies, technologiesToRemove, profilePic } = this.state

        if(!userForm.name)
            alert('Name is a required field');

        const oldTechsIds = technologiesToRemove.map(i => i.id)
            .concat(technologies.filter(i=>i.id).map(i => i.id));

        const techs = technologies
            .map(i => ({technologyId: i.technology.id}))

        let profilePicUrl = userForm.profilePicUrl

        if (profilePic) {

            this.setState({wait: true})

            const file = {
                uri: profilePic,
                name: uuidv4() + ".jpg",
                type: "image/jpeg"
            }

            const options = {
                keyPrefix: AWS_S3_PROFILE_PICS,
                bucket: AWS_S3_BUCKET,
                region: AWS_S3_REGION,
                accessKey: AWS_S3_ACCESS_KEY,
                secretKey: AWS_S3_SECRET_KEY,
                successActionStatus: 201
            }

            const s3Res = await RNS3.put(file, options);

            if(s3Res.status !== 201) {
                this.setState({wait: false})
                console.log('\n>>>>> Fail to upload profile pic to S3', s3Res);
                alert('Fail to upload profile picture, please try again later');
                return;
            }

            profilePicUrl = 'https://' + options.bucket + '.s3.amazonaws.com/' +
                options.keyPrefix + file.name;
        }

        this.setState({wait: true})

        UpdateUserMutation(userForm.id, userForm.name,
            userForm.bio, profilePicUrl, techs, oldTechsIds,
            async (err, res) => {
                this.setState({wait: false})

                if(err) {
                    console.log('Error while updating Profile', err);
                    alert('Error while updating Profile: ' + err);
                    return;
                }

                this.setState({ edit: false, technologies: [], technologiesToRemove: []})
                this.props.relay.refetch({id: userForm.id}, null, (res) => {
                    console.log('refetch finished', res)
                    this._reloadTechs()
                });

                // this.props.navigation.navigate('Profile');
            })
    }

    _doPickImage = async (useCamera) => {
        const pickerFunction = useCamera ? ImagePicker.launchCameraAsync :
            ImagePicker.launchImageLibraryAsync;

        let result = await pickerFunction({
            allowsEditing: true,
            aspect: [4, 4],
        });

        if (!result.cancelled) {
            this.setState({ profilePic: result.uri });
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

    render() {
        const userNode = this.props.viewer.allUsers.edges[0].node;

        const { canEdit, edit, userForm, profilePic } = this.state

        const user = edit ? userForm : userNode;

        return (
            <View style={{flex: 1,}}>
                <Header title={user.name}
                        navigateBack={this.props.navigation.state.params.navigateBack}
                        rightMenu={ canEdit ?
                            <TouchableOpacity
                                onPress={() => this.setState({edit: !this.state.edit, userForm: {...user}})} >
                                <MaterialIcons
                                    name={!edit ? "mode-edit" : "keyboard-backspace"}
                                    size={26}
                                    style={{
                                        color: 'white',
                                        marginTop: 2}} />
                            </TouchableOpacity> : null }
                        navigation={this.props.navigation} />
                <ScrollView style={{paddingHorizontal: '5%'}}>
                    <View style={{
                        marginTop: 25,
                        flexDirection: 'row',
                    }}>
                        <TouchableOpacity
                            onPress={() => edit && this._pickImage()}
                            style={{
                                borderWidth: 2,
                                borderColor:'#6C9CF2',
                                width:62,
                                height:62,
                                borderRadius:32,
                            }}>
                            <Image
                                source={profilePic ? {uri: profilePic} :
                                    user.profilePicUrl ? {uri: user.profilePicUrl} :
                                        require('../../assets/images/user.png')}
                                style={{
                                    height: 56,
                                    width: 56,
                                    marginTop: 1,
                                    marginLeft: 1,
                                    borderRadius: 28}}
                            />
                        </TouchableOpacity>
                        <View style={{
                            marginTop: -14,
                            marginLeft: 15,
                            width: '100%'
                        }}>
                            {edit ?
                            <FieldInput
                                label="NAME"
                                value={user.name}
                                onChange={(v) => this._setUserField('name', v)}
                                readOnly={!edit} /> : null }
                            <FieldInput
                                label="EMAIL"
                                value={user.email}
                                onChange={(v) => this._setUserField('email', v)}
                                readOnly={true} />
                        </View>
                    </View>

                    { user.bio || edit ?
                        <View style={{marginTop: 0,}}>
                            <FieldInput 
                                label="BIO"
                                value={user.bio}
                                onChange={(v) => this._setUserField('bio', v)}
                                readOnly={!edit} />
                        </View> : null
                    }

                    <View>
                        <View style={{marginTop: 25}}><TechnologiesBlock
                            edit={edit}
                            technologies={this.state.technologies}
                            addTechnology={this._addTech}
                            removeTechnology={this._removeTech}
                            empty="User has no technologies skills..."
                            label="SKILLS" /></View>

                        { !edit ?
                            <View style={{marginTop: 16}}>
                                <Text
                                    style={{
                                        fontFamily: 'space-mono-bold',
                                        color: '#7B7B7B',
                                        marginBottom: 12,
                                        fontSize: 15}}>CHECK-INS</Text>

                                {user.checkins.edges.length ?
                                    <CheckinList navigation={this.props.navigation}
                                        displayPlace={true} displayUser={false} displayHackingHours={true}
                                        checkins={user.checkins.edges.map(({node}) => node)} /> :
                                    <Text>OOoops... Looks like we have a brand new baby here that never hacked!</Text>}

                                { canEdit ? <TouchableOpacity
                                    style={{
                                        marginTop: 50,
                                        alignSelf: 'center',
                                        backgroundColor: '#e54054',
                                        width: 90,
                                        paddingVertical: 5,
                                    }}  onPress={this._logout}>
                                    <Text style={{color: 'white',fontFamily: 'space-mono-bold',
                                        textAlign: 'center'}}>
                                        LOG OUT
                                    </Text>
                                </TouchableOpacity> : null }
                            </View> : null}
                    </View>
                </ScrollView>

                { edit ? <View>
                    <TouchableOpacity
                        style={main.bottomPrimaryButton}
                        onPress={!this.state.wait ? this._submitProfile : () => null} >
                        <Text style={main.primaryButtonText}>
                            {this.state.wait ? 'Please wait...' : 'Submit' }
                        </Text>
                    </TouchableOpacity>
                </View> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
    },
});

export default createRefetchContainer(Profile,
    { viewer: graphql`
        fragment Profile_viewer on Viewer {
            allUsers(filter: $filter, first: 1)
            @connection(key: "Profile_allUsers") {
                edges {
                    node {
                        id,
                        email,
                        name,
                        bio,
                        profilePicUrl
                        facebook,
                        twitter,
                        github,
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
                        },
                        reviews {
                            edges {
                                node {
                                    id,
                                    description,
                                    rate,
                                    postedBy {
                                        id,
                                        name,
                                        profilePicUrl
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
                                        email
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
    `
    },
    graphql`
        query ProfilePageQuery(
            $filter: UserFilter!
        ) {
            viewer {
                ...Profile_viewer
            }
        }
    `
)