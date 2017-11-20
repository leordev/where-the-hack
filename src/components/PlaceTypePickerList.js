import React from 'react';
import { Platform, Picker } from 'react-native';

import {
    createFragmentContainer,
    graphql
} from 'react-relay'

import ModalPicker from './ModalPicker'

class PlaceTypePickerList extends React.Component {

    state = {
        textInputValue: 'testing picker'
    }

    render() {

        if(Platform.OS === 'ios') {
            const data = this.props.viewer.allPlaceTypes.edges.map(({node}, index) => {
                    return ({ key: node.id, label: node.name})
                }
            )

            const val = data.find((item) => item.key === this.props.value)

            return (
                <ModalPicker
                    data={data || []}
                    initValue={val && val.label || 'Please Select'}
                    onChange={(option) => this.props.onValueChange(option.key)}>
                </ModalPicker>
            )
        } else {
            return (<Picker
                selectedValue={this.props.value}
                onValueChange={(itemValue, itemIndex) => this.props.onValueChange(itemValue)}>

                <Picker.Item label={`Please select`} value={null}/>

                {this.props.viewer.allPlaceTypes.edges.map(({node}, index) => {
                        return (<Picker.Item key={node.id}
                                             label={node.name}
                                             value={node.id}/>)
                    }
                )}
            </Picker>)
        }
    }
}

export default createFragmentContainer(PlaceTypePickerList, graphql`
    fragment PlaceTypePickerList_viewer on Viewer {
        allPlaceTypes(first: 100, orderBy: name_ASC) 
        @connection(key: "PlaceTypePickerList_allPlaceTypes", filters: []) {
            edges {
                node {
                    id,
                    name
                }
            }
        }
    }
`)
