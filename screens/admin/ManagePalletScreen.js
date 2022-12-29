import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from "react-native";
import Button from '../../components/Button';
import ListItem from '../../components/ListItem';
import SubHeader from '../../components/SubHeader';
import TextInput from '../../components/TextInput';


const ManagePalletScreen = ({ route, navigation }) => {

    return(
        <View style={styles.container}>
            <TextInput 
                placeholder="Search Item Name" 
                search
                style={styles.search}
            />
            <Button 
                style={styles.button}
                onPress={() => navigation.navigate("EditPallet")}
                text="ADD PALLET" 
            />
            <SubHeader 
                title="Item Name" 
                secondTitle="Barcode Number"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    search: {
        marginBottom: 20,
        marginTop: 20
    },
    button: {
        marginBottom: 10
    }
});

export default ManagePalletScreen;