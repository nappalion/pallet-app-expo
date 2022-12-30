import React, { useState } from 'react';
import { StyleSheet, View } from "react-native";
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { database } from "../../firebaseConfig.js"
import { ref, child, set, get, remove } from "firebase/database";

function writeUserData(empId, fullName) {
    set(ref(database, 'users/' + empId), {
        name: fullName,
    });
}

function userExists(empId) {
    return get(child(ref(database), `users/${empId}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("User exists.");
          return true;
        } else {
          console.log("User does not exist.");
          return false;
        }
    }).catch((error) => {
        console.error(error);
        return false;
    });
}

function deleteUser(empId) {
    remove(ref(database, 'users/' + empId));
}


const EditCreateUserScreen = ({ route, navigation }) => {

    const [ empId, setEmpId ] = useState((route.params.empId) ? route.params.empId : "");
    const [ fullName, setFullName ] = useState((route.params.fullName) ? route.params.fullName : "");
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");
    const [ isNew, setIsNew ] = useState((route.params.isNew) ? route.params.isNew : "");

    return(
        <View style={styles.container}>
            <View>
                <TextInput
                    title="Employee ID" 
                    placeholder="Enter or scan an employee ID."
                    notEditable={ !isNew }
                    value={ empId }
                    onChangeText={(text) => {
                            setEmpId(text)
                        }
                    }   
                />
                <TextInput
                    title="Full Name" 
                    placeholder="Enter your full name."
                    value={ fullName }
                    onChangeText={(text) => {
                            setFullName(text)
                        }
                    }   
                />
                <Button 
                    style={styles.button}
                    text="SAVE CHANGES" 
                    onPress={ () => { 
                        userExists(empId).then((result) => {
                            if (result && isNew) {
                                console.log("User already exists.")
                            }
                            else if (fullName && empId) { 
                                writeUserData(empId, fullName) 
                                if (isNew) {
                                    navigation.goBack();
                                }
                            } 
                        })
                    }}
                />
            </View>
            <Button 
                style={styles.button}
                text="DELETE USER" 
                secondary
                onPress={ () => {
                    console.log("User deleted.");
                    if (currUser.empId == empId) {
                        console.log("Deleting this user will log you out.");
                    } else {
                        deleteUser(empId);
                        navigation.goBack();
                    }
                }}
            />
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    button: {
        marginTop: 20,
        marginBottom: 10
    }
});

export default EditCreateUserScreen;