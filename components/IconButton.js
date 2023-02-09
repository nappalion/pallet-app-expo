import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image} from "react-native";
import { COLORS } from '../colors';

function IconButton(props) {
    return(
        <TouchableOpacity {...props}>
            <Image
                source={require("../assets/barcode-box.png")}
            />
        </TouchableOpacity>
    );
}

export default IconButton;