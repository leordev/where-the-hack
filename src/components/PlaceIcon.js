import React from 'react';
import {View, Text} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, PLACE_ICON} from '../constants'

class PlaceIcon extends React.Component {
    render() {
        const { type, display, checkedIn } = this.props

        const { color, icon, name } = PLACE_ICON[type.id]

        const iconElement = <MaterialIcons
            name={icon}
            size={20}
            style={{color: checkedIn ? COLORS.RED : '#4989fc',}}
        />

        return (iconElement);
    }
}

export default PlaceIcon