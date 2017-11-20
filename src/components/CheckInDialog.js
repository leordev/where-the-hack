import React from 'react';
import {View, Text, TextInput, Button, AsyncStorage, Dimensions, Alert} from 'react-native'

import {COLORS, GC_USER_ID} from "../constants";
import PopupDialog, {DialogButton, DialogTitle} from "react-native-popup-dialog";
import CreateCheckinMutation from "../mutations/CreateCheckinMutation";

class CheckInDialog extends React.Component {

    state = {
        checkinText: null
    }

    _submitCheckIn = async () => {

        const postedById = await AsyncStorage.getItem(GC_USER_ID);
        const { place } = this.props

        if (!postedById || !place || !place.id) {
            alert('User and Place are required to Submit a Check-In');
            return;
        }

        CreateCheckinMutation(
            !place.needApproval,
            this.state.checkinText,
            place.id,
            postedById,
            (err, res) => {
                if(err) {
                    console.log(err);
                    if(err.source && err.source.errors && err.source.errors.length) {
                        const errMsg = err.source.errors[0].message;
                        alert('An error has occurred on the Check-In request: ' +
                            errMsg);
                    } else {
                        alert(err);
                    }
                    return;
                }

                console.log('\n>>>>> New Check-In was submitted: ' + res.id);

                const approvalMessage = place.needApproval ?
                    ' Please wait a few minutes while we contact the owners' +
                    ' to get your approval!' :
                    ' Please head to the hacking space ASAP to not lose your' +
                    ' station! Go Go Go!';

                Alert.alert('Check-In Request', 'Your Check-In Request was Submitted SUCCESSFULLY!' +
                    approvalMessage, [
                    {text: 'OK', onPress: () => {
                        this.props.close(res)
                    }}
                ]);
            }
        )
    }

    render() {

        const { place, show } = this.props

        const popupWidth = (Dimensions.get('window')).width - 20;

        return (
            <PopupDialog
                width={popupWidth}
                height={380}
                dialogTitle={<DialogTitle title={place.name + ' Check-In Submission'} />}
                show={show}
                actions={[
                    <DialogButton
                        text="Cancel"
                        align={'center'}
                        onPress={() => {
                            this.checkinDialog.dismiss();
                            this.props.close();
                        }}
                        key="checkin-dialog-cancel"
                    />
                ]}
                ref={(checkinDialog) => { this.checkinDialog = checkinDialog; }}>
                <View style={{flex: 1}}>

                    {/*{place.needApproval ?*/}
                        {/*<Text style={{margin: 8, color: COLORS.RED}}>*/}
                            {/*The owner of this place approves every single check-in request...*/}
                            {/*So you better tell your story! :D*/}
                        {/*</Text> :*/}
                        {/*<Text style={{margin: 8, color: COLORS.GREEN}}>*/}
                            {/*This place doesn't require any approval but*/}
                            {/*it'd be AWESOME if you could say what are you*/}
                            {/*into today! Chances are ppl will join you ;)*/}
                        {/*</Text>}*/}

                    <Text style={{margin: 8, color: COLORS.GREEN}}>
                        What are you into today?
                    </Text>

                    <View style={{margin: 8,
                        borderWidth: 1,
                        borderColor: COLORS.BLUE}}>
                        <TextInput multiline={true}
                                   numberOfLines={4}
                                   style={{fontSize: 18, height: 80}}
                                   onChangeText={(text) => this.setState({checkinText: text})}
                                   value={this.state.checkinText} />
                    </View>
                    <Button
                        title="Submit Check-In"
                        onPress={this._submitCheckIn} />
                </View>
            </PopupDialog>
        );
    }
}

export default CheckInDialog