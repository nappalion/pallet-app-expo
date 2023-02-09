import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";

import { COLORS } from '../../colors';

import TextInput from '../../components/TextInput';
import Button from "../../components/Button";

import { database } from "../../firebaseConfig.js"
import { ref, child, set, get, remove } from "firebase/database";

import CameraIcon from '../../assets/camera-fill.js';

function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str))
}

function palletExists(barcode) {
    return get(child(ref(database), `barcodes/${barcode}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Item exists.");
          return true;
        } else {
          console.log("Item does not exist.");
          return false;
        }
    }).catch((error) => {
        console.error(error);
        return false;
    });
}

function writePalletData(barcode, itemName, length, width, height) {
    set(ref(database, 'barcodes/' + barcode), {
        name: itemName,
        length: length,
        width: width,
        height: height
    });
}

function deletePallet(barcode) {
    remove(ref(database, 'barcodes/' + barcode));
}

const EditPalletScreen = ({ route, navigation }) => {
    const [ barcode, setBarcode ] = useState((route.params.barcode) ? route.params.barcode : "" )
    const [ itemName, setItemName ] = useState((route.params.itemName) ? route.params.itemName : "" )
    const [ length, setLength ] = useState((route.params.dimensions) ? route.params.dimensions.length.toString() : "" )
    const [ width, setWidth ] = useState((route.params.dimensions) ? route.params.dimensions.width.toString() : "" )
    const [ height, setHeight ] = useState((route.params.dimensions) ? route.params.dimensions.height.toString() : "" )
    const [ isNew, setIsNew ] = useState((route.params.isNew) ? route.params.isNew : false);
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");


    useEffect(() => {
        if (isNew) {
            navigation.setOptions({
                headerTitle: "Add Item"
            });
        } else {
            navigation.setOptions({
                headerTitle: "Edit Item"
            });
        }
    }, [navigation]);

    useEffect(() => {
        setBarcode(route.params?.barcode || '');
    }, [route.params])


    return(
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <View style={styles.barcodeView}>
                        <TextInput 
                            title="Barcode No." 
                            style={styles.barcodeInput}
                            placeholder="Enter a barcode number"
                            notEditable={ !isNew }
                            value={ barcode }
                            onChangeText={(text) => {
                                    setBarcode(text)
                                    console.log("barcode is " + barcode)
                                }
                            }   
                        />

                    { isNew 
                        && <CameraIcon
                            style={styles.barcodeScanButton}
                            onPress={() => { navigation.navigate('Barcode', { currUser: currUser }) }}
                        />
                    }



                    </View>


                    <TextInput 
                        title="Item Name" 
                        placeholder="Enter an item name"
                        value={ itemName }
                        onChangeText={(text) => {
                                setItemName(text)
                            }
                        }   
                    />

                    <TextInput 
                        title="Length" 
                        placeholder="Enter a length"
                        value={ length }
                        onChangeText={(text) => {
                                setLength(text)
                            }
                        }   
                    />

                    <TextInput 
                        title="Width" 
                        placeholder="Enter a width"
                        value={ width }
                        onChangeText={(text) => {
                                setWidth(text)
                            }
                        }   
                    />
                    
                    <TextInput 
                        title="Height" 
                        placeholder="Enter a height"
                        value={ height }
                        onChangeText={(text) => {
                                setHeight(text)
                            }
                        }   
                    />

                    <Button 
                        text="SAVE CHANGES" 
                        style={ styles.button }
                        onPress={ () => {
                                palletExists(barcode).then((result) => {
                                    if (!(itemName && barcode && length && width && height)) {
                                        Alert.alert("Invalid field.", "Please enter a barcode, item name, length, width, and height.")
                                    }
                                    else if (result && isNew) {
                                        Alert.alert("Item already exists.", "Please find and edit/delete the existing item.")
                                    }
                                    else if (itemName && barcode && length && width && height) { 
                                        if (isNumeric(length) && isNumeric(width) && isNumeric(height)) {
                                            writePalletData(barcode, itemName, Math.ceil(parseFloat(length)).toString(), Math.ceil(parseFloat(width)).toString(), Math.ceil(parseFloat(height)).toString())
                                            
                                            if (isNew) {
                                                Alert.alert("Success", "Item created successfully!")
                                                navigation.goBack();
                                            } else {
                                                Alert.alert("Success", "Item edited successfully!")
                                                navigation.goBack();
                                            }
                                        }
                                        else {
                                            Alert.alert("Invalid field.", "Please enter a valid number for the length, width, and height.")
                                        }
                                    } 
                                })
                            }
                        }
                    />

                    <Button 
                        text="CALCULATE" 
                        style={ styles.button }
                        onPress={ () => {
                                if (length && width && height) {
                                    if (isNumeric(length) && isNumeric(width) && isNumeric(height)) {
                                        navigation.navigate('Results', {
                                            currUser: currUser,
                                            dimensions: {
                                                length: Math.ceil(parseFloat(length)),
                                                width: Math.ceil(parseFloat(width)),
                                                height: Math.ceil(parseFloat(height))
                                            }
    
                                        })
                                    } else {
                                        Alert.alert("Invalid field.", "Please enter a valid number for the length, width, and height.")
                                    }
                                } else {
                                    Alert.alert("Invalid field.", "Please enter a length, width, and height.")
                                }
                            }
                        }
                    />

                </View>

                <Button 
                    text="DELETE" 
                    style={ styles.button }
                    secondary
                    onPress={ () => { 
                        Alert.alert(
                            "Are you sure you want to delete this item?",
                            "Deleting this item will permanently remove this pallet's existing data.",
                            [
                                {
                                    text: "DELETE",
                                    onPress: () => {
                                        deletePallet(barcode);
                                        navigation.navigate('ManagePallet', {
                                            currUser: currUser
                                        })
                                    },
                                },
                                {
                                    text: "CANCEL",
                                }
                            ],
                        )

                    }}
                />
            </View>
        </ScrollView>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
        marginBottom: 10
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

export default EditPalletScreen;