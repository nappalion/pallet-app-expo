import React from 'react';
import { Image, StyleSheet, View } from "react-native";
import { COLORS } from '../colors';


import TextInput from '../components/TextInput';
import Button from "../components/Button";

const LoginScreen = ({ navigation }) => {
    return(
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/logo.png')}/>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.textInput}
                    placeholder="Please enter an email..." 
                    title="Email"
                />
                <TextInput 
                    style={styles.textInput}
                    placeholder="Please enter a password..." 
                    title="Password"
                />
                <Button
                    text="LOGIN"
                    style={styles.button}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    inputContainer: {
        flex: 0.7,
    },
    logo: {
        width: "65%",
        height: "20%",
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    button: {
        marginTop: 20
    }
});

export default LoginScreen;