import React, { useState, useRef, useEffect } from 'react';

import { View, StyleSheet, Image, Alert, ScrollView } from "react-native";

import { TextInput as RNTextInput } from 'react-native';

import TextInput from '../components/TextInput.js';
import Button from '../components/Button.js';

import { database } from "../firebaseConfig.js"
import { ref, child, set, get, remove } from "firebase/database";
import CameraIcon from '../assets/camera-fill.js';


function palletExists(barcode) {
    return get(child(ref(database), `barcodes/${barcode}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Item exists.");
          return snapshot.val();
        } else {
          console.log("Item does not exist.");
          return false;
        }
    }).catch((error) => {
        console.error(error);
        return false;
    });
}

const CalculateScreen = ({ route, navigation }) => {
    let inputRef = useRef(null);
    const [ barcode, setBarcode ] = useState((route.params.barcode) ? route.params.barcode : "" )
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return(
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <View style={styles.barcodeView}>
                        <TextInput 
                            style={styles.barcodeInput}
                            title="Barcode No." 
                            placeholder="Enter a barcode number"
                            forwardedRef={inputRef}
                            value={ barcode }
                            onChangeText={(text) => {
                                    setBarcode(text)
                                }
                            }   
                        />
                        <CameraIcon
                            style={styles.barcodeScanButton}
                            onPress={() => { navigation.navigate('Barcode', { currUser: currUser, previousScreenName: "Calculate" }) }}
                        />
                    </View>
                    
                    <Button 
                        text="ENTER" 
                        style={ styles.button }
                        onPress={ () => {
                                if (barcode) {
                                    palletExists(barcode).then((result) => {
                                        if (result) {
                                            navigation.navigate('Results', {
                                                currUser: currUser,
                                                dimensions: {
                                                    length: Math.ceil(parseFloat(result.length)),
                                                    width: Math.ceil(parseFloat(result.width)),
                                                    height: Math.ceil(parseFloat(result.height))
                                                }
                                            })
                                        }
                                        else {
                                            Alert.alert(
                                                "Barcode doesn't exist.", 
                                                "Please scan another barcode or contact your supervisor.",
                                            )
                                        }
                                    });
                                }
                                else {
                                    Alert.alert("Invalid Field.", "Please enter a valid barcode.")
                                }
                                
                            }
                        }
                    />
                </View>
                
                
                <Image
                    style={ styles.box } 
                    source={require('../assets/box.png')}/>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    box: {
        height: 300,
        marginTop: 30,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    button: {
        marginTop: 15
    },
    barcodeView: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    barcodeInput: {
        flex: 1,
        marginRight: 10
    },
    barcodeScanButton: {
        marginBottom: 15,
        alignSelf: 'flex-end'
    }
});

export default CalculateScreen;