import React, { useState } from 'react';
import { View, StyleSheet } from "react-native";

import { COLORS } from '../colors';

import TextInput from '../components/TextInput';
import Button from "../components/Button";

const CalculateScreen = ({ route, navigation }) => {
    const [ barcode, setBarcode ] = useState(route.params)
    const [ length, setLength ] = useState("")
    const [ width, setWidth ] = useState("")
    const [ height, setHeight ] = useState("")

    return(
        <View style={styles.container}>
            <View>
                <TextInput 
                    title="Barcode No." 
                    placeholder="Enter a barcode number"
                    value={ barcode }
                    onChangeText={(text) => {
                            setBarcode(text)
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
                    text="CALCULATE" 
                    style={ styles.button }
                    onPress={ () => {
                            navigation.navigate('Results', {
                                l: parseInt(length),
                                w: parseInt(width),
                                h: parseInt(height)
                            })
                        }
                    }
                 />
            </View>
            <Button 
                text="SCAN AGAIN" 
                secondary
                onPress={ () => { navigation.navigate('Barcode') }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 30,
        marginBottom: 30
    },
    button: {
        marginTop: 20
    }
});

export default CalculateScreen;