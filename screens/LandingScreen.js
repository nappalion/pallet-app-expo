import React, { useState } from 'react';
import { Image, View, StyleSheet, Text} from "react-native";
import { COLORS } from '../colors';
import { database } from "../firebaseConfig.js"
import { ref, child, get } from "firebase/database";

import Button from '../components/Button';


const LandingScreen = ({ route, navigation }) => {

    const [ empId, setEmpId ] = useState((route.params) ? route.params.empId : "" );
    const [ isAdmin, setIsAdmin ] = useState(false);
    
    get(child(ref(database), `admin/${empId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("User is an admin.");
            setIsAdmin(true)
        } else {
            console.log("User is not an admin.");
            setIsAdmin(false)
        }
        }).catch((error) => {
        console.error(error);
        setIsAdmin(false)
    });

    return(
        <View style={ styles.container }>
            <Image
                style={ styles.logo } 
                source={require('../assets/logo.png')}/>
            <Image
                style={ styles.box } 
                source={require('../assets/box.png')}/>

            <View style={ styles.inputContainer }>
                <Button
                    text="SCAN BOX"
                    style={ styles.button }
                    onPress={ () => { navigation.navigate("Barcode") }}
                />

                {
                    isAdmin &&
                    <View> 
                        <Button
                            text="MANAGE USER ACCOUNTS"
                            style={styles.button}
                        />

                        <Button
                            text="MANAGE PALLETS"
                            style={styles.button}
                        />
                    </View>
                    
                }

                <Button
                    text="LOGOUT"
                    secondary
                    style={ styles.button }
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
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    inputContainer: {
        flex: 2,
        marginTop: 20
    },
    button: {
        marginTop: 10,
        marginBottom: 10
    },
    logo: {
        width: "30%",
        height: "10%",
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    box: {
        flex: 1.5,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
});

export default LandingScreen;