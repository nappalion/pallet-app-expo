import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../colors';

import Button from "../components/Button";

const BarcodeScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

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
                    console.log("hello")
                }} text="Open Form"/>
            )
        });
    }, [navigation]);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        navigation.navigate('Calculate', {
            barcode: parseInt(data)
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