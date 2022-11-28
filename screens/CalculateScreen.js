import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import Button from "../components/Button"
import { COLORS } from '../colors';
import TextInput from '../components/TextInput';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    scanButton: {
        width: "100%",
        backgroundColor: COLORS.dark_gray,
        alignSelf: 'center',
        marginBottom: 20,
    },
    calculateButton: {
        width: "100%",
        backgroundColor: COLORS.purple,
        alignSelf: 'center',
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
    },
    textInput: {
        borderRadius: 10,
        borderWidth: 1,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between'
    },
    buttons: {
        width: "100%"
    },
    textInputs: {
        flex: 1
    }
})

const CalculateScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [length, setLength] = useState();
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();

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
                                <Text style={styles.textStyle}>Item Information</Text>
                                <View style={styles.textInputs}>
                                    <TextInput 
                                        value={barcodeData}
                                        header="Barcode No."
                                        container={{marginBottom: 10}}
                                        style={styles.textInput}
                                        borderColor={COLORS.dark_gray}
                                        onChangeText={(text) => {
                                                setBarcodeData(text)
                                            }
                                        }
                                        placeholder="Enter a barcode number"
                                    />
                                    <TextInput 
                                        value={length}
                                        header="Length"
                                        container={{marginBottom: 10}}
                                        style={styles.textInput}
                                        borderColor={COLORS.dark_gray}
                                        onChangeText={(text) => {
                                                setLength(text)
                                            }
                                        }
                                        placeholder="Enter a length"
                                    />
                                    <TextInput 
                                        value={width}
                                        header="Width"
                                        container={{marginBottom: 10}}
                                        style={styles.textInput}
                                        borderColor={COLORS.dark_gray}
                                        onChangeText={(text) => {
                                                setWidth(text)
                                            }
                                        }
                                        placeholder="Enter a width"
                                    />
                                    <TextInput 
                                        value={height}
                                        header="Height"
                                        container={{marginBottom: 10}}
                                        style={styles.textInput}
                                        borderColor={COLORS.dark_gray}
                                        onChangeText={(text) => {
                                                setHeight(text)
                                            }
                                        }
                                        placeholder="Enter a height"
                                    />
                                </View>
                                
                                <View style={styles.buttons}>
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
                                            setModalVisible(false);
                                            setScanned(false); 
                                            navigation.navigate('Results')
                                        }} 
                                    /> 
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    
                </TouchableOpacity>
            </Modal>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
};

export default CalculateScreen

