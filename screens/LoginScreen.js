import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BoxImage from "../assets/closed-box.svg";
import Button from "../components/Button";
import { COLORS } from '../colors';
import auth from '@react-native-firebase/auth';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    textInput: {
        borderRadius: 10,
        borderWidth: 1,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between'
    },
    buttonText: {
        color: 'white',
    },
    textStyle: {
        textAlign: 'center'
    },
    button: {
        width: "50%",
        backgroundColor: COLORS.dark_gray,
        alignSelf: 'center'
    },
    logo: {
        width: "30%",
        height: "10%",
        resizeMode: 'contain',
        alignSelf: 'center'
    },
});


const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    }

    useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    function loginWithEmailPassword(email, password) {
        auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Sign in sucessful!');
            setUser(userCredential.user);
        })
        .catch(error => {
            console.error(error);
        });
    }

    if (user) {
        navigation.navigate('Landing');
    }

    return(
        <SafeAreaView style={styles.container}>
            <Image 
                style={styles.logo} 
                source={require('../assets/logo.png')}/>
            <TextInput 
                value={barcodeData}
                header="Username."
                container={{marginBottom: 10}}
                style={styles.textInput}
                borderColor={COLORS.dark_gray}
                onChangeText={(text) => {
                        setEmail(text)
                    }
                }
                placeholder="Enter a barcode number"
            />
            <TextInput 
                value={length}
                header="Password"
                container={{marginBottom: 10}}
                style={styles.textInput}
                password
                borderColor={COLORS.dark_gray}
                onChangeText={(text) => {
                        setPassword(text)
                    }
                }
                placeholder="Enter a length"
            />
            <Button 
                style={styles.button}
                textStyle={styles.buttonText}
                text={'Tap to Scan Again'}
                onPress={() => {
                    loginWithEmailPassword(email, password)
                }} 
            /> 
        </SafeAreaView>
    );
};

export default LoginScreen