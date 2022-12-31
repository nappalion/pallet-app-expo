import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../colors';

import Button from "../components/Button";

import { database } from "../firebaseConfig.js"
import { ref, child, set, get, remove } from "firebase/database";
import IconButton from '../components/IconButton';

const BarcodeScreen = ({ route, navigation }) => {
    const [currUser, setCurrUser] = useState((route.params?.currUser) ? route.params.currUser : "");
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

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

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status == 'granted');
        };
        
        getBarCodeScannerPermissions();
    }, []);

    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton onPress={() => {                        
                        setScanned(true); 
                        navigation.navigate("Calculate", {
                            barcode: "",
                            currUser: currUser
                        })
                    }}
                />
            )
        });
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setScanned(false);
        });
        return unsubscribe;
    }, [scanned]);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
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
                        }
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
        else {
            palletExists(data).then((result) => {
                if (result) {
                    console.log(result)
                    navigation.navigate('Calculate', {
                        barcode: data,
                        currUser: currUser,
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
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
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