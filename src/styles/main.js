'use strict';

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	fbButtonImg: {
		width: 18,
	},
	inputField: {
		height: 40,
		width: '100%',
		backgroundColor: 'white',
		shadowOpacity: 0.75,
		shadowRadius: 5,
		shadowColor: '#b9b3b3',
		shadowOffset: {height: 0, width: 0},
	},
	inputLabel: {
		fontFamily: 'open-sans-bold',
		color: '#7B7B7B',
		marginTop: 30,
		marginBottom: 4,
	},
	bottomPrimaryButton: {
		height: 60,
		width: '100%',
		backgroundColor: '#4989fc',
		justifyContent: 'center', 
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		left: 0,
		shadowColor: '#ABA9A9',
		shadowOpacity: 1,
		shadowOffset: {width: 0, height: 0}
	},
	primaryButtonText: {
		color: 'white',
		fontFamily: 'space-mono-bold',
		fontSize: 22,
	},
});