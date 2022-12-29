import React, { useState } from 'react';
import { Image, StyleSheet, View } from "react-native";
import { COLORS } from '../colors';
import { auth } from "../firebaseConfig.js"

import TextInput from '../components/TextInput';
import Button from "../components/Button";



const LoginScreen = ({ navigation }) => {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    return(
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/logo.png')}/>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.textInput}
                    placeholder="Scan your ID." 
                    title="Employee ID"  
                    value={email}
                    onChangeText={(text) => {
                            setEmail(text)
                        }
                    }
                />
                <TextInput 
                    isPassword={true}
                    style={styles.textInput}
                    placeholder="Please enter a password..." 
                    title="Password"
                    value={password}
                    onChangeText={(text) => {
                            setPassword(text)
                        }
                    }
                />
                <Button
                    text="LOGIN"
                    style={styles.button}
                    onPress={ 
                        navigation.navigate("Landing")
                    }
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