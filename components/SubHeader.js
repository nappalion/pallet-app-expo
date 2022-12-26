import React from 'react';
import { TouchableHighlight, View, Text, StyleSheet} from "react-native";
import { COLORS } from '../colors';

function SubHeader(props) {
    const styles = StyleSheet.create({
        container: {
            padding: 5,
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: COLORS.gray,
            flexDirection: "row",
        },
        title: {
            fontSize: 15,
        },
        details: {
            fontSize: 15,
            fontWeight: "bold"
        }
    })

    return(
        <View style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.details}>{props.details}</Text>
        </View>
    );
}

export default SubHeader;