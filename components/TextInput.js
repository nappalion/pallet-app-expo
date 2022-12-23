import React from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { COLORS } from '../colors';

function TextInput(props) {
    const [hidePassword, setHidePassword] = React.useState(props.isPassword)

    return(
        <View style={ [styles.container, props.style] }>
            <Text style={styles.header}>{props.title}</Text>
            <View 
                style={styles.textField}
                borderColor = {props.error ? "#f54242" : COLORS.gray}>
                <RNTextInput 
                    value={props.value}
                    style={styles.input}
                    onChangeText={props.onChangeText}
                    onSubmitEditing={props.onSubmitEditing}
                    placeholder = {props.placeholder}
                    placeholderTextColor = { COLORS.light_purple }
                    secureTextEntry={hidePassword}
                    ref={props.ref}/>

                {props.isPassword && 
                    <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                        {hidePassword 
                            ? console.log("Eye on")
                            : console.log("Eye off")
                        }
                    </TouchableOpacity>
                }
            </View>
            

            {props.error && (
                <Text style={styles.error}>
                {props.error}
                </Text>
            )}
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: "100%",
        borderRadius: 10,
        alignItems: 'flex-start',
    },
    error: {
        color: COLORS.red, 
        fontSize: 12
    },
    textField: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 10,
        borderWidth: 1.5,
        justifyContent: 'space-between'
    },
    input: {
        flex: 1,
        height: "100%",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        color: COLORS.dark_purple,
        fontSize: 17
    },
    header: {
        color: COLORS.dark_purple,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingBottom: 5
    }
});

export default TextInput;