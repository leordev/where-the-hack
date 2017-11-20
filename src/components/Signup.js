import React from 'react';
import { StyleSheet, AsyncStorage, View, Button, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import { AppLoading, Font, AuthSession, Asset } from 'expo';
import CreateUserMutation from '../mutations/CreateUserMutation'
import SigninUserMutation from '../mutations/SigninUserMutation'
import {GC_AUTH_TOKEN, GC_START_PAGE, GC_USER_ID} from "../constants";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import mainStyles from '../styles/main';

import * as Animatable from 'react-native-animatable';
import SigninFacebookMutation from "../mutations/SigninFacebookMutation";
import {NavigationActions} from "react-navigation";

const FB_APP_ID = '207985509742088';

export default class Signup extends React.Component {

    state = {
        view: null,
        name: null,
        email: null,
        password: null,
        password2: null,
        loaded: false,
        waiting: false,
        userId: null
    }

    static navigationOptions = {
        drawerLabel: 'Home',
        drawerLockMode: 'locked-closed'
    };

    componentWillMount() {
        // checking login before mount and go to next page if logged in

    }

    async componentDidMount() {
        // await Font.loadAsync({
        //     'open-sans': require('../../assets/fonts/Open_Sans/OpenSans-Regular.ttf'),
        //     'open-sans-semi': require('../../assets/fonts/Open_Sans/OpenSans-Bold.ttf'),
        //     'open-sans-bold': require('../../assets/fonts/Open_Sans/OpenSans-SemiBold.ttf'),
        //     'space-mono': require('../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf'),
        //     'space-mono-bold': require('../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf')
        // });
        // const userId = await AsyncStorage.getItem(GC_USER_ID);
        //
        // // if(userId) {
        // //     const resetAction = NavigationActions.reset({
        // //         index: 0,
        // //         actions: [
        // //             NavigationActions.navigate({ routeName: GC_START_PAGE,
        // //                 params: {userId: userId}})
        // //         ]
        // //     })
        // //     this.props.navigation.dispatch(resetAction)
        // // }
        //
        // this.setState({loaded: true})
        //
        // if (userId) {
        //     this.props.navigation.navigate(GC_START_PAGE, {
        //         userId: userId
        //     })
        // }
    }

    _saveUserData = async (id, token) => {
        await AsyncStorage.multiSet([[GC_USER_ID, id], [GC_AUTH_TOKEN, token]]);
    }

    _handleFbLogin = async () => {
        let redirectUrl = AuthSession.getRedirectUrl();

        console.log('\n>>>>> Facebook Redirect URL: ', redirectUrl);

        let result = await AuthSession.startAsync({
            authUrl:
            `https://www.facebook.com/v2.11/dialog/oauth?response_type=token` +
            `&client_id=${FB_APP_ID}` +
            `&scope=email` +
            `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
        });

        console.log('\n>>>>> Facebook Login result:', result);

        if(result && result.type === "success" &&
            result.params && result.params.access_token) {

            this.setState({waiting: true})
            SigninFacebookMutation(result.params.access_token, async (err, id, token) => {
                this.setState({waiting: false})

                if(err) {
                    console.log(err);
                    if(err.response && err.response && err.response.errors &&
                        err.response.errors.length) {
                        const errMsg = err.response.errors[0].message;
                        alert(errMsg);
                    } else {
                        alert('An error has occurred on the SignUp request: ' +
                            err);
                    }
                    return;
                }

                await this._saveUserData(id, token)

                this.props.navigation.navigate('Map', {userId: id})
            })

        }
    };

    _signup = () => {
        const {
            email, password, password2, waiting
        } = this.state

        // do not call twice
        if(waiting)
            return;

        if(!email ||
            !password) {
            return alert('please fill email and password')
        }

        if(email.indexOf('@') <= 0) {
            return alert('invalid email');
        }

        const name = email.split('@')[0];

        // if(password !== password2) {
        //     return alert('password does not match')
        // }

        this.setState({waiting: true})

        CreateUserMutation(name, email, password, async (err, id, token) => {
            this.setState({waiting: false})

            if(err) {
                console.log(err);
                if(err.response && err.response && err.response.errors &&
                    err.response.errors.length) {
                    const errMsg = err.response.errors[0].message;
                    alert(errMsg);
                } else {
                    alert('An error has occurred on the SignUp request: ' +
                        err);
                }
                return;
            }

            await this._saveUserData(id, token)

            this.props.navigation.navigate('Map', {userId: id})
        })
    }

    /** Login page **/
    _login = () => {
        const {
            waiting, email, password
        } = this.state

        // do not call twice
        if(waiting)
            return;

        if(!email || !password) {
            return alert('please fill all fields data')
        }

        this.setState({waiting: true})

        SigninUserMutation(email, password, (err, id, token) => {
            this.setState({waiting: false})
            if(err) {
                console.log(err);
                if(err.response && err.response && err.response.errors &&
                    err.response.errors.length) {
                    const errMsg = err.response.errors[0].message;
                    alert(errMsg);
                } else {
                    alert('An error has occurred on the signin request: ' +
                        err);
                }
                return;
            }

            this._saveUserData(id, token)

            this.props.navigation.navigate('Map', {userId: id})
        })
    }

    _resetView = (view) => {
        this.setState({
            view,
            name: null,
            email: null,
            password: null,
            password2: null
        })
    }

    _renderLogin = () => {
        return (
            <Animatable.View
                animation="slideInRight"
                duration={500}
                style={{width: '100%', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', width:'70%', marginBottom: 10}}>
                    <TouchableOpacity
                        onPress={() => this._resetView()}>
                        <Image
                            source={require('../../assets/images/back.png')}
                            style={{alignSelf: 'flex-start', width: 30, resizeMode: 'contain', marginTop: 4}}/>
                    </TouchableOpacity>
                    <Text style={{fontFamily: 'space-mono', color: 'white', fontSize: 22, marginRight: 35, alignSelf:'center', flex: 1, textAlign: 'center'}}>Sign In</Text>
                </View>
                <TextInput
                    placeholder='Email'
                    style={{width: '70%', height: 50, borderRadius: 2, paddingLeft: 6, marginBottom: 10, backgroundColor: 'white', fontSize: 15}}
                    onChangeText={(text) => this.setState({email: text})}
                    value={this.state.email}
                />
                <TextInput
                    secureTextEntry={true}
                    placeholder='Password'
                    style={{width: '70%', height: 50, borderRadius: 2, paddingLeft: 6, marginBottom: 10, backgroundColor: 'white'}}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                />

                <TouchableOpacity
                    style={{backgroundColor: '#00b9a9', width: '70%', height: 50, borderRadius: 2,height: 50, justifyContent: 'center', alignItems: 'center'}}
                    onPress={this._login}>
                    <Text style={{color: 'white', fontFamily: 'space-mono', fontSize: 18,}}>
                        { this.state.waiting ? 'Please Wait...' : 'Login' }
                    </Text>
                </TouchableOpacity>
            </Animatable.View>
        )
    }

    _renderMenu = () => {
        return (
            <Animatable.View
                animation="slideInUp"
                duration={500}
                style={{width: "100%", alignItems: 'center'}}>
                <TouchableOpacity
                    style={{backgroundColor:'#3b579d', height: 50, width: '70%', justifyContent:'center',alignItems:'center',borderRadius: 2}}
                    onPress={this._handleFbLogin}>
                    <View style={{flexDirection: 'row',}}>
                        <Image 
                            source={require('../../assets/images/fbLogo.png')}
                            style={{alignSelf: 'center', marginBottom: 7, marginRight: 15,}}
                        />
                        <Text style={{color: 'white', fontSize: 16, width: 150, alignSelf: 'center'}}>Login with Facebook</Text>
                    </View>
                </TouchableOpacity>

                <Text style={{color:'white', fontSize: 14, fontFamily:'open-sans-bold', marginVertical: 20}}>or sign up with email</Text>

                <TextInput
                    placeholder='Email'
                    style={{width: '70%', height: 50, borderRadius: 2, paddingLeft: 6, marginBottom: 10, backgroundColor: 'white', fontSize: 15}}
                    onChangeText={(text) => this.setState({email: text})}
                    value={this.state.email}
                />

                <TextInput
                    secureTextEntry={true}
                    placeholder='Password'
                    style={{width: '70%', height: 50, borderRadius: 2, paddingLeft: 6, marginBottom: 10, backgroundColor: 'white'}}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                />

                <TouchableOpacity
                    style={{backgroundColor: '#00b9a9', width: '70%', height: 50, borderRadius: 2,height: 50, justifyContent: 'center', alignItems: 'center'}}
                    onPress={this._signup}>
                    <Text style={{color: 'white', fontFamily: 'space-mono', fontSize: 18,}}>
                        { this.state.waiting ? 'Please Wait...' : 'Sign Up' }
                    </Text>
                </TouchableOpacity>

                <Text style={{color: 'white', fontSize: 15, marginTop: 20}}>Already a member?</Text>
                <TouchableOpacity
                    onPress={()=>this.setState({view:'login'})}>
                    <View style={{borderBottomColor: '#00b9a9', borderBottomWidth: 2,}}>
                        <Text style={{color: '#00b9a9', fontFamily: 'open-sans-semi', fontSize: 15,}}>
                            Sign In
                        </Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        )
    }

    _cacheResourcesAsync = async () => {
        const assets = [
            require('../../assets/images/back.png'),
            require('../../assets/images/Background.jpg'),
            require('../../assets/images/fbLogo.png'),
            require('../../assets/images/user.png'),
        ];

        const cacheImages = assets.map((asset) => {
            return Asset.fromModule(asset).downloadAsync();
        });

        await Font.loadAsync({
            'open-sans': require('../../assets/fonts/Open_Sans/OpenSans-Regular.ttf'),
            'open-sans-semi': require('../../assets/fonts/Open_Sans/OpenSans-Bold.ttf'),
            'open-sans-bold': require('../../assets/fonts/Open_Sans/OpenSans-SemiBold.ttf'),
            'space-mono': require('../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf'),
            'space-mono-bold': require('../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf')
        });

        const userId = await AsyncStorage.getItem(GC_USER_ID);

        this.setState({userId})

        if (userId) {
            console.log('\n>>>>> User was already logged in, going to Start Page')

            this.props.navigation.navigate(GC_START_PAGE, {
                userId: userId
            })
        }

        return Promise.all(cacheImages)

    }

    _finishLoading = () => {
        this.setState({ loaded: true })

        if (this.state.userId) {
            this.props.navigation.navigate(GC_START_PAGE, {
                userId: this.state.userId
            })
        }
    }

    render() {
        const { view, loaded } = this.state

        if(!loaded)
            return <AppLoading
                startAsync={this._cacheResourcesAsync}
                onFinish={this._finishLoading}
                onError={console.warn}
            />

        return <View style={{paddingVertical: 35,
            width: '100%',height: '100%',
            alignItems: 'center'}}>
            <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 1600,
                }}>
                <Image
                    style={{flex: 10}}
                    source={require('../../assets/images/Background.jpg')} />
            </View>
            <Text style={{fontFamily: 'space-mono-bold', fontSize: 32, color: 'white', marginTop: 30}}>WHERE THE HACK</Text>
            <Text style={{fontFamily: 'open-sans', color: 'white', textAlign: 'center',
                marginTop: 10, marginBottom: 20, fontSize: 22,}}>
                It's a New and Fun Way to
                {"\n"}Empower Your Network and
                {"\n"}Finish Your Projects
            </Text>
            {view === 'login'? this._renderLogin():this._renderMenu()}
        </View>
    }

}