import React from 'react';
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BoxImage from "../assets/closed-box.svg";
import Button from "../components/Button";
import { COLORS } from '../colors';

const styles = StyleSheet.create({

});


const LoginScreen = ({ navigation }) => {
    return(
        <SafeAreaView style={styles.container}>
            <Image 
                style={styles.logo} 
                source={require('../assets/logo.png')}/>
            <TextInput></TextInput>
            <TextInput></TextInput>
            <Button></Button>
        </SafeAreaView>
    );
};

export default LandingScreen