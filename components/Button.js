import React from 'react';
import { TouchableHighlight, View, Text, StyleSheet} from "react-native";
import { COLORS } from '../colors';

function Button(props) {
    
    const styles = StyleSheet.create({
        container: {
            height: 65,
            borderRadius: 10,
            borderWidth: 1,
            justifyContent: 'center',
            backgroundColor: props.secondary ? COLORS.white : COLORS.purple,
            borderColor: props.secondary ? COLORS.purple : COLORS.white,
        },
        text: {
            textAlign: 'center',
            fontSize: 15,
            color: props.secondary ? COLORS.purple : COLORS.white
        }
    })

    return(
        <TouchableHighlight 
            {...props}
            underlayColor={COLORS.dark_purple}
            style={[styles.container, props.style]}
        >
            <View>
                <Text style={styles.text}>{props.text}</Text>

            </View>
        </TouchableHighlight>
    );
};



export default Button;