import React from 'react';
import { Image, View, StyleSheet, Text} from "react-native";
import { COLORS } from '../colors';

import Button from '../components/Button';

const LandingScreen = ({ navigation }) => {

    const isAdmin = false;
    return(
        <View style={ styles.container }>
            <Image
                style={ styles.logo } 
                source={require('../assets/logo.png')}/>
            <Image
                style={ styles.box } 
                source={require('../assets/box.png')}/>

            <View style={ styles.inputContainer }>
                <Button
                    text="SCAN BOX"
                    style={ styles.button }
                    onPress={ navigation.navigate("Barcode") }
                />

                {
                    isAdmin &&
                    <View> 
                        <Text style={ styles.textSpacer }>OR</Text>
                        <Button
                            text="MANAGE USER ACCOUNTS"
                            style={styles.button}
                        />
                        <Button
                            text="LOGIN"
                            secondary
                            style={ styles.button }
                        />
                    </View>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    inputContainer: {
        flex: 2,
        marginTop: 20
    },
    button: {
        marginTop: 10,
        marginBottom: 10
    },
    logo: {
        flex: 1,
        width: "30%",
        height: "10%",
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    box: {
        flex: 2,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    textSpacer: {
        color: COLORS.light_purple,
        textAlign: "center"
    }
});

export default LandingScreen;