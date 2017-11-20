import React from "react";

import {Text, TextInput, View} from "react-native";


export class FieldInput extends React.Component {
    render() {

        const {
            readOnly,
            type,
            label,
            value,
            onChange
        } = this.props

        if (readOnly) {
            return (
                <View>
                    <Text style={{
                        fontFamily: 'space-mono-bold',
                        color: '#7B7B7B',
                        marginTop: 20,
                        marginBottom: 4,
                        fontSize: 15
                    }}>{label}</Text>
                    <Text style={{color: '#181818'}}>{value}</Text>
                </View>
            )
        } else {
            return (
                <View style={this.props.style}>
                    <Text style={{
                        fontFamily: 'space-mono-bold',
                        color: '#7B7B7B',
                        marginTop: 30,
                        marginBottom: 4,
                    }}>{label}:</Text>
                    <TextInput
                        style={{
                            fontFamily: 'open-sans',
                            justifyContent: 'flex-start',
                            height: 40,
                            width: '100%',
                            paddingBottom: 10,
                            backgroundColor: 'white',
                            shadowOpacity: 0.75,
                            shadowRadius: 5,
                            shadowColor: '#b9b3b3',
                            shadowOffset: {height: 0, width: 0},
                        }}
                        value={value}
                        onChangeText={(text) => onChange(text)} />
                </View>
            )
        }
    }


}