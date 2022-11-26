import React from 'react';
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BoxImage from "../assets/closed-box.svg";
import Button from "../components/Button";
import { COLORS } from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    textStyle: {
        textAlign: 'center'
    },
    button: {
        width: "50%",
        backgroundColor: COLORS.dark_gray,
        alignSelf: 'center'
    },
    buttonText: {
        color: 'white',
    },
    logo: {
        width: "30%",
        height: "10%",
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    box: {
        marginTop: 40,
        marginBottom: 30
    }
})

const LandingScreen = ({ navigation }) => {
    return(
        <SafeAreaView style={styles.container}>
            <Image 
                style={styles.logo} 
                source={require('../assets/logo.png')}/>
            <BoxImage
                style={styles.box}
                height="40%"
                width="100%"/>
            <Button 
                text="Scan Box" 
                style={styles.button} 
                textStyle={styles.buttonText}
                onPress={() => navigation.navigate('Calculate')}>

            </Button>
        </SafeAreaView>
    );
};

export default LandingScreen