import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, Text, ScrollView} from "react-native";
import { COLORS } from '../colors';
import { database } from "../firebaseConfig.js"
import { ref, child, get } from "firebase/database";

import Button from '../components/Button';


const LandingScreen = ({ route, navigation }) => {

    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");

    return(
        <ScrollView contentContainerStyle={{flexGrow:1}}>
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
                        onPress={ () => { navigation.navigate("Barcode", {
                            currUser: currUser,
                            previousScreenName: "Landing"
                        }) }}
                    />

                    {
                        currUser.isAdmin &&
                        <View> 
                            <Button
                                text="MANAGE USER ACCOUNTS"
                                style={styles.button}
                                onPress={ () =>
                                    navigation.navigate('ManageUsers', {
                                        currUser: currUser
                                    }) 
                                }
                            />

                            <Button
                                text="MANAGE PALLETS"
                                style={styles.button}
                                onPress={ () =>
                                    navigation.navigate('ManagePallet', {
                                        currUser: currUser
                                    }) 
                                }
                            />
                        </View>
                        
                    }

                    <Button
                        text="LOGOUT"
                        secondary
                        style={ styles.button }
                        onPress = { () => {
                                navigation.popToTop();
                            } 
                        }
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 100
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
        height: 300,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
});

export default LandingScreen;