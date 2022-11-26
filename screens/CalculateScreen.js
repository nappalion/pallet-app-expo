import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import Button from "../components/Button"
import { COLORS } from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    scanButton: {
        width: "100%",
        backgroundColor: COLORS.dark_gray,
        alignSelf: 'center'
    },
    calculateButton: {
        width: "100%",
        backgroundColor: COLORS.purple,
        alignSelf: 'center'
    },
    buttonText: {
        color: 'white',
    },
    modal: {
        width: "80%",
        height: "80%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyle: {
        textAlign: 'center'
    }
})

const CalculateScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status == 'granted');
        };
        
        getBarCodeScannerPermissions();
    }, []);

    const [modalVisible, setModalVisible] = useState(false);

    const [barcodeData, setBarcodeData] = useState("")

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setModalVisible(true)
        setBarcodeData(data)
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return(

        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    setScanned(false);
                }}
            >
                <TouchableOpacity 
                    style={styles.container}
                    onPress={() => {
                        setModalVisible(false);
                        setScanned(false); 
                    }} 
                >
                        <TouchableWithoutFeedback>
                            <View style={styles.modal}>
                                <Text style={styles.textStyle}>Barcode: {barcodeData}</Text>
                                <Button 
                                    style={styles.scanButton}
                                    textStyle={styles.buttonText}
                                    text={'Tap to Scan Again'}
                                    onPress={() => {
                                        setModalVisible(false);
                                        setScanned(false); 
                                    }} 
                                /> 
                                <Button 
                                    style={styles.calculateButton}
                                    textStyle={styles.buttonText}
                                    text={'Calculate'}
                                    onPress={() => {
                                        navigation.navigate('Results')
                                    }} 
                                /> 
                            </View>
                        </TouchableWithoutFeedback>
                    
                </TouchableOpacity>
            </Modal>
            <BarCodeScanner
                text="Scan Again"
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
};

export default CalculateScreen

