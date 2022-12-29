import React, { useState } from 'react';
import { Image, StyleSheet, View } from "react-native";
import { COLORS } from '../colors';
import { database } from "../firebaseConfig.js"
import { ref, child, get } from "firebase/database";

import TextInput from '../components/TextInput';
import Button from "../components/Button";

function userExists(empId) {
    console.log("Checking if " + empId.toString() + " exists.")
    return get(child(ref(database), `users/${empId}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("User exists.");
          return true;
        } else {
          console.log("User does not exist.");
          return false;
        }
    }).catch((error) => {
        console.error(error);
        return false;
    });
}
function isAdmin(empId) {
    return get(child(ref(database), `admin/${empId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("User is an admin.");
            return true
        } else {
            console.log("User is not an admin.");
            return false
        }
        }).catch((error) => {
        console.error(error);
        return false
    });
}



const LoginScreen = ({ navigation }) => {
    const [ empId, setEmpId ] = useState("")

    return(
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/logo.png')}/>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder="Please enter an email..." 
                    title="Employee ID"  
                    value={empId}
                    onChangeText={(text) => {
                            setEmpId(text)
                        }
                    }
                />
                <Button
                    text="LOGIN"
                    style={styles.button}
                    onPress={ () => {
                            if (empId != "") {
                                userExists(empId).then( (userExists) => {
                                    isAdmin(empId).then( (isAdmin) => {
                                            if (userExists) {
                                                navigation.navigate('Landing', {
                                                    currUser: { empId: empId, isAdmin: isAdmin }
                                                })
                                            } else {
                                                console.log("User not found.")
                                            }
                                        }
                                    )
                                });
                            }
                            else {
                                console.log("Employee ID cannot be empty!")
                            }
                        }
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
        marginTop: 10
    }
});

export default LoginScreen;