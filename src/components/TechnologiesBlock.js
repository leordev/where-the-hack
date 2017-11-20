import React from 'react'
import {Text, TouchableOpacity, View} from "react-native";
import {COLORS} from "../constants";


import {
    QueryRenderer,
    graphql, createFragmentContainer
} from "react-relay";
import environment from '../Environment'
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ModalPicker from "./ModalPicker";

class TechnologyTag extends React.Component {
    render() {

        const { technology, edit, onPress } = this.props

        return <TouchableOpacity
            onPress={() => onPress(technology)}>
            <Text>
                {technology.technology.name}

                {edit ?
                    <MaterialIcons
                        name={"close"}
                        size={16} />
                 : null }
            </Text>
            { edit ? <View style={{margin: 0, padding: 0,
                borderLeftWidth: 1, paddingTop: 5, marginRight: 5,
                borderLeftColor: COLORS.GREY_LIGHTEN_1,
                width: 14, height: 28}}>
                <MaterialIcons
                    style={{
                        color: COLORS.GREY_LIGHTEN_1
                    }}
                    name={"close"}
                    size={16} />
            </View> : null }
        </TouchableOpacity>
    }
}

class TechnologiesPicker extends React.Component {

    render() {
        const { technologies } = this.props

        const data = this.props.viewer.allTechnologies.edges
            .filter(({node}) => {
                return !technologies.find(t => t.technology.id === node.id)
            })
            .map(({node}, index) => {
                return ({ key: node.id, label: node.name})
            }
        )

        return <View>
            {this.props.technologies.map((item,index) => {
                return <TechnologyTag key={index}
                                      onPress={this.props.removeTechnology}
                                      technology={item}
                                      edit={true} />
            })}

            <ModalPicker
                selectStyle={{borderWidth: 0}}
                selectTextStyle={{color: COLORS.BLUE, fontSize: 14}}
                data={data || []}
                fixedLabel={true}
                initValue={'Add New...'}
                onChange={(option) => this.props.addTechnology({id: option.key, name: option.label})}>
            </ModalPicker>
        </View>
    }
}

const TechnologiesPickerFragment = createFragmentContainer(TechnologiesPicker, graphql`
    fragment TechnologiesBlock_viewer on Viewer {
        allTechnologies(first: 1000, orderBy: name_ASC)
        @connection(key: "TechnologiesPicker_allTechnologies", filters: []) {
            edges {
                node {
                    id,
                    name
                }
            }
        }
    }
`)

const TechnologiesBlockQuery = graphql`
    query TechnologiesBlockQuery {
        viewer {
            ...TechnologiesBlock_viewer
        }
    }
`

export default class TechnologiesBlock extends React.Component {

    _renderPicker() {
        return(
            <QueryRenderer
                environment={environment}
                query={TechnologiesBlockQuery}
                render={({error, props}) => {
                    if (error) {
                        return <View><Text>{error.message}</Text></View>
                    } else if (props) {
                        return <TechnologiesPickerFragment {...this.props}
                                                    viewer={props.viewer} />
                    }
                    return <View>
                        <Text>Loading Technologies...</Text>
                    </View>
                }}
            />
        )
    }

    _renderView() {

        const { technologies } = this.props

        return (
            <View style={{
                flexDirection: 'row',
                paddingLeft: '3.5%',
                paddingRight: '2%',
                flexWrap: 'wrap',
            }}>
                {technologies.map(t =>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 25,
                            marginBottom: 9,
                        }}
                        key={t.id}>
                        <View style={{
                            backgroundColor: '#90b4f5',
                            width: 5,
                            height: 5,
                            marginRight: 6,}}></View>
                        <Text style={{fontSize: 15,}}>
                            {t.technology.name}
                        </Text>
                    </View>)}
            </View>
        )
    }

    render() {

        const { label, edit, empty, technologies } = this.props

        return (
            <View>
                {label ? <Text style={{
                    fontFamily: 'space-mono-bold',
                    color: '#7B7B7B',
                    marginBottom: 7,
                    fontSize: 15
                }}>{label}</Text> : null }
                {edit ? this._renderPicker() : technologies.length ?
                    this._renderView() : <Text style={{marginTop: -4}}>{empty || ''}</Text>}
            </View>
        )
    }
}