import React from 'react';
import { Text, View, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NewCheckinSubscription from "../subscriptions/NewCheckinSubscription";
import CheckinHeaderHandler from "./CheckinHeaderHandler";
import {NavigationActions} from "react-navigation";

export default class Header extends React.Component {

    // componentDidMount() {
    //     if(!this.props.skipCheckin)
    //         NewCheckinSubscription()
    // }

    render() {

        const marginTop = Platform.OS === 'ios' ? 55 : 30;

        return (
            <View style={{
                height: 100,
                backgroundColor: '#6c9cf2',
                shadowColor: '#ABA9A9',
                shadowOpacity: 1,
                shadowOffset: {width: 0, height: 1},
                paddingHorizontal: 20,
            }}>
                <View style={{
                    flex: 1,
                    width: '100%',
                    marginTop,
                    flexDirection: 'row',
                    justifyContent: 'space-between'}}>
                        {this.props.hideMenu ? null :
                            <MaterialIcons
                                onPress={() => this.props.navigateBack ?
                                    this.props.navigation.dispatch(NavigationActions.back()) :
                                    this.props.backButton ?
                                    this.props.backButton() :
                                    this.props.navigation.navigate('DrawerToggle')}
                                name={this.props.backButton || this.props.navigateBack ?
                                    "keyboard-backspace" : "menu"}
                                size={32}
                                style={{color: 'white',}} /> }
                        <Text style={{
                            color: 'white',
                            fontFamily: 'space-mono-bold',
                            fontSize: 20,
                        }}>{this.props.title}</Text>
                    <View style={{
                        flex: 0,
                        flexDirection: 'row',}}>
                        { this.props.rightMenu }
                    </View>
                </View>
            </View>
        );
    }
}