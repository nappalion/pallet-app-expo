import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../colors';


import Button from "../components/Button";

import { database } from "../firebaseConfig.js"
import { ref, child, set, get, remove } from "firebase/database";
import IconButton from '../components/IconButton';

import { useFocusEffect } from '@react-navigation/native';

const BarcodeScreen = ({ route, navigation }) => {
    const [currUser, setCurrUser] = useState((route.params?.currUser) ? route.params.currUser : "");
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [key, setKey] = useState(0);

    const previousScreenName = route.params.previousScreenName

    function palletExists(barcode) {
        let filteredBarcode = barcode.replace(/[^0-9]/g, "")
        console.log(filteredBarcode)
        return get(child(ref(database), `barcodes/${filteredBarcode}`)).then((snapshot) => {
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

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status == 'granted');
        };
        
        getBarCodeScannerPermissions();
    }, []);

    useFocusEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton onPress={() => {                        
                        setScanned(true); 
                        navigation.navigate("Calculate", {
                            barcode: "",
                            currUser: currUser,
                        })
                    }}
                />
            )
        });
    });

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setKey(key + 1);
            setScanned(false);
        });
        return unsubscribe;
    }, [scanned]);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        if (previousScreenName == "Landing") {
            palletExists(data).then((result) => {
                if (result) {
                    console.log(result)
                    navigation.navigate('Results', {
                        currUser: currUser,
                        dimensions: {
                            length: parseFloat(result.length),
                            width: parseFloat(result.width),
                            height: parseFloat(result.height)
                        },
                        itemName: result.name,
                        previousScreenName: previousScreenName
                    })
                }
                else {
                    Alert.alert(
                        "Barcode doesn't exist.", 
                        "Please scan another barcode or contact your supervisor.",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    setScanned(false)
                                },
                            },
                        ],
                    )
                }
            });
        }

        else if (previousScreenName == "Calculate") {
            palletExists(data).then((result) => {
                if (result) {
                    console.log(result)
                    navigation.navigate('Calculate', {
                        currUser: currUser,
                        barcode: data,
                        previousScreenName: previousScreenName
                    })
                }
                else {
                    Alert.alert(
                        "Barcode doesn't exist.", 
                        "Please scan another barcode or contact your supervisor.",
                        [
                            {
                                text: "OK",
                                onPress: () => {
                                    setScanned(false)
                                },
                            },
                        ],
                    )
                }
            });
        }

        else if (previousScreenName == "EditCreatePallet") {
            if ( currUser.isAdmin ) {
                palletExists(data).then((result) => {
                    if (result) {
                        navigation.navigate('EditCreatePallet', {
                            currUser: currUser,
                            barcode: data,
                            itemName: result.name,
                            dimensions: { 
                                length: result.length,
                                width: result.width,
                                height: result.height
                            },
                            previousScreenName: previousScreenName
                        });
                    }
                    else {
                        console.log("Barcode doesn't exist.")
                        navigation.navigate('EditCreatePallet', {
                            barcode: data,
                            currUser: currUser,
                            isNew: true
                        })
                    }
                });
            }
        }
        setKey(key + 1);
    };

    if (hasPermission === null) {
        return(
          <View style={styles.container}>
            <Text>Requesting for camera permission</Text>
          </View>  
        );
    }

    if (hasPermission === false) {
        return(
            <View style={styles.container}>
                <Text>No access to camera</Text>
            </View>
        );
    }

    return(
        <View>
            <BarCodeScanner
                key={key}
                onBarCodeScanned={scanned ? () => { return undefined } : handleBarCodeScanned}
                style={{height: "100%", width: "100%"}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    }
});

export default BarcodeScreen;