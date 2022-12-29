import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../colors';

import Button from "../components/Button";
import TextInput from '../components/TextInput';

const BarcodeScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState("");

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
        navigation.navigate('Calculate', {
            barcode: data
        })
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return(
        <View>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{height: "90%", width: "100%"}}
            />
            <TextInput 
                    placeholder="Please enter or scan a barcode." 
                    title="Barcode Number"  
                    value={barcode}
                    onChangeText={(text) => {
                            setBarcode(text)
                        }
                    }
                    // onSubmitEditing={() =>
                    //     setTimeout(function() {
                    //         navigation.navigate('Calculate', {
                    //             barcode: barcode
                    //         })
                    //     }, 2500)
                    // }
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