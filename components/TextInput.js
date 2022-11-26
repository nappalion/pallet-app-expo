import React from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Eye from "../assets/eye-line.svg"
import EyeOff from "../assets/eye-off-line.svg"

const styles = StyleSheet.create({
    container: {
        height: "auto",
        width: "100%",
        borderRadius: 10,
        alignItems: 'flex-start'
    },
    error: {
        color: "#f54242", 
        fontSize: 12
    },
    textField: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    input: {
        height: "100%",
        flex: 1
    }
});

function TextInput(props) {
    const [hidePassword, setHidePassword] = React.useState(props.password)

    return(
        <View style={[styles.container, props.container]}>
            <Text>{props.header}</Text>
            <View 
                style={[styles.textField, props.style]}
                borderColor= {props.error ? "#f54242" : props.borderColor}>
                <RNTextInput 
                    value={props.value}
                    style={styles.input}
                    onChangeText={props.onChangeText}
                    onSubmitEditing={props.onSubmitEditing}
                    placeholder = {props.placeholder}
                    secureTextEntry={hidePassword}
                    ref={props.ref}/>

                {props.password && 
                    <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                        {hidePassword 
                            ? <Eye width="100%" height="100%"/>
                            : <EyeOff width="100%" height="100%"/>
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

export default TextInput;