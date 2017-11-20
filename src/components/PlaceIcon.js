import React from 'react';
import {View, Text} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PLACE_ICON} from '../constants'

class PlaceIcon extends React.Component {
    render() {
        const { type, display } = this.props

        const { color, icon, name } = PLACE_ICON[type.id]

        const iconElement = <MaterialIcons
            name={icon}
            size={20}
            style={{color: '#4989fc',}}
        />

        return (iconElement);
    }
}

export default PlaceIcon