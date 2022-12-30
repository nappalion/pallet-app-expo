import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../colors';

import Button from "../components/Button";

import { database } from "../firebaseConfig.js"
import { ref, child, set, get, remove } from "firebase/database";

const BarcodeScreen = ({ route, navigation }) => {
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");
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
                <Button onPress={() => {                        
                    setScanned(true); 
                    navigation.navigate("Calculate")
                }} text="Open Form"/>
            )
        });
    }, [navigation]);

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
                    })
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
                    console.log("Barcode doesn't exist.")
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