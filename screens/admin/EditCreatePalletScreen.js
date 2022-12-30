import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from "react-native";

import { COLORS } from '../../colors';

import TextInput from '../../components/TextInput';
import Button from "../../components/Button";

import { database } from "../../firebaseConfig.js"
import { ref, child, set, get, remove } from "firebase/database";

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
    const [ isNew, setIsNew ] = useState((route.params.isNew) ? route.params.isNew : "");
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");

    return(
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <TextInput 
                        title="Barcode No." 
                        placeholder="Enter a barcode number"
                        notEditable={ !isNew }
                        value={ barcode }
                        onChangeText={(text) => {
                                setBarcode(text)
                            }
                        }   
                    />

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
                                    if (result && isNew) {
                                        console.log("Pallet already exists.")
                                    }
                                    else if (itemName && barcode && length && width && height) { 
                                        writePalletData(barcode, itemName, Math.ceil(parseFloat(length)).toString(), Math.ceil(parseFloat(width)).toString(), Math.ceil(parseFloat(height)).toString())
                                        if (isNew) {
                                            navigation.goBack();
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
                                    navigation.navigate('Results', {
                                        currUser: currUser,
                                        dimensions: {
                                            length: Math.ceil(parseFloat(length)),
                                            width: Math.ceil(parseFloat(width)),
                                            height: Math.ceil(parseFloat(height))
                                        }

                                    })
                                }
                            }
                        }
                    />

                    <Button 
                        text="SCAN AGAIN" 
                        style={ styles.button }
                        onPress={ () => { navigation.navigate('Barcode', { currUser: currUser }) }}
                    />
                </View>

                <Button 
                    text="DELETE" 
                    style={ styles.button }
                    secondary
                    onPress={ () => { 
                        console.log("User deleted.");
                        deletePallet(barcode);
                        navigation.goBack();
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
    }
});

export default EditPalletScreen;