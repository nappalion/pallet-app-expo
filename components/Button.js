import React from 'react';
import { TouchableHighlight, View, Text, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    container: {
        height: 70,
        borderRadius: 20,
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: 15
    }
})

function Button(props) {

    return(
        <TouchableHighlight 
            {...props}
            style={[styles.container, props.style]}
        >
            <View>
                <Text style={[styles.text, props.textStyle]}>{props.text}</Text>

            </View>
        </TouchableHighlight>
    );
};

export default Button;