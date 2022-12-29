import React from 'react';
import { TouchableHighlight, View, Text, StyleSheet } from "react-native";
import { COLORS } from '../colors';


function ListItem(props) {
    return(
        <TouchableHighlight 
            style={styles.container}
            underlayColor={COLORS.light_gray}
            onPress={props.onPress}>
            <View style={styles.subContainer}>
                <Text>{props.name}</Text>
                <Text>{props.number}</Text>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',

    },
    subContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    }
});



export default ListItem;