import React from 'react'
import {COLORS} from "../constants";
import {Text, TouchableOpacity, View} from "react-native";
import moment from "moment";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TechnologiesBlock from "./TechnologiesBlock";
import mainStyles from '../styles/main';

class CheckinList extends React.Component {
    _renderReviewStars(rate) {
        const stars = [];
        for(let i = 1; i <= rate; i++) {
            stars.push(<MaterialIcons
                key={`star-${i}`}
                style={{color: '#6c9cf2'}}
                name={'star'}
                size={12} />);
        }
        return stars;
    }

    render() {

        const { checkins, displayUser, displayPlace, displayHackingHours, displayHackersCounter } = this.props

        const totalHackingMillis = checkins.reduce((total, i) => {

            if (i.approvalTime && i.approved && !i.canceled) {
                const hackTime = (i.checkoutAt ? moment(i.checkoutAt) : moment())
                    .diff(i.approvalTime);

                return total + hackTime
            }

            return total;
        }, 0);

        const totalHackingHours = Math.round(moment.duration(totalHackingMillis).asHours());

        const hackers = (checkins &&
            checkins.filter(node => node.approved &&
                !node.canceled && !node.checkoutAt).length) || 0

        return (
            <View>
                { displayHackingHours && totalHackingHours > 0 ?
                    <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                        <Text style={{fontFamily: 'space-mono-bold',
                            color: COLORS.GREEN,
                            marginBottom: 4,
                            fontSize: 12}}>
                            TOTAL HACKING TIME: {totalHackingHours} HOUR
                            {totalHackingHours > 1 ? 'S' : null}
                        </Text>
                    </View> : null}

                { displayHackersCounter ? <Text style={{
                        fontFamily: 'space-mono-bold',
                        color: '#666666',
                        marginBottom: 10,
                        marginTop: 20,}}>
                        {hackers ? `${hackers} ${hackers > 1 ? 'HACKERS' :
                            'HACKER'} HERE NOW` :
                            'NO HACKERS HERE NOW'}
                    </Text> : null
                }

                {checkins.filter(node => !node.canceled).map(node => {
                    const technologies = (displayUser && node.user.technologies && node.user.technologies.edges
                        && node.user.technologies.edges) || []

                    return (<View key={node.id}>
                        <TouchableOpacity onPress={() => displayUser ?
                            this.props.navigation.navigate('Profile', {userId: node.user.id, navigateBack: true})
                            : displayPlace ?
                                null : //this.props.navigation.navigate('Map', {placeId: node.place.id, navigateBack: true}) :
                                null}>
                            <Text style={{color: node.checkoutAt ? '#848484' : COLORS.GREEN,}}>
                                {displayPlace ? `${!node.checkoutAt ? 'ONLINE ' : '' } @ ${node.place.name.toUpperCase()}` : null}
                                {displayUser ? node.user.name.toUpperCase() : null}
                                {node.description && node.checkoutAt ?
                                    ` - worked on ${node.description}` :
                                    node.description ?
                                        ` - working on ${node.description}` :
                                    !node.checkoutAt && !displayPlace ? ' is Working now' : null
                                }
                                {displayUser && technologies.length ? `; Skill Set: ` : null}
                            </Text>

                            {technologies.length ?
                                <View style={{marginTop: 5}}>
                                    <TechnologiesBlock
                                        edit={false}
                                        technologies={node.user.technologies.edges
                                            .slice(0, 6)
                                            .map(i => i.node)}
                                        empty={null}
                                        label={null} />
                                </View> : null
                            }

                            {node.placeReview ?
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{
                                        marginTop: 2,
                                        marginLeft: 3,
                                        fontFamily: 'open-sans-bold',
                                        fontSize: 13,
                                        color: '#848484',
                                    }}>{moment(node.checkinAt).fromNow()}</Text>
                                    <Text style={{
                                        marginTop: 3,
                                        marginLeft: 2.75}}>
                                        {node.placeReview && this._renderReviewStars(node.placeReview.rate)}</Text>
                                </View> : null
                            }

                            { !node.approved && node.approvalTime ?
                                <Text>
                                    {node.rejectionDescription}
                                </Text> : null
                            }


                            { !node.canceled && !node.approved && !node.approvalTime ?
                                <Text>
                                    Waiting for Approval
                                </Text> : null
                            }
                            { node.canceled ?
                                <Text>
                                    CANCELED
                                </Text> : null
                            }
                        </TouchableOpacity>


                        <View style={{
                            marginVertical: 14,
                            backgroundColor: '#99bdfd',
                            height: 1,
                            width: '10%',
                        }}></View>

                    </View>)
                })}
            </View>
        )
    }
}

export default CheckinList