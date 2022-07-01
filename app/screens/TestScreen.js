import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AppText from '../components/AppText';
import Screen from '../components/Screen';
import colors from '../config/colors';

function TestScreen({navigation}) {
    return (
        <Screen>
            <View style = {styles.container}>
                <AppText style = {styles.titleheader}>Test Screen</AppText>
            </View>

            <Image style={styles.tinyLogo} source={require('../assets/couch.jpg')} />
            <AppText style = {styles.test}>Name of Test Screen</AppText>
        </Screen>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: colors.light
    },
    titleheader: {
        fontSize: 28,
        color: colors.primary,
        fontWeight: "bold"
    },
    test: {
        fontSize: 20,
        color: colors.orange,
        fontWeight: "bold"
    },
    tinyLogo: {
        margin: 23,
        width: 350,
        height: 300,
    },
})


export default TestScreen;