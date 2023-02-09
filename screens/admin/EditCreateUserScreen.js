import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, ScrollView } from "react-native";
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
    remove(ref(database, 'admin/' + empId));
}


const EditCreateUserScreen = ({ route, navigation }) => {

    const [ empId, setEmpId ] = useState((route.params.empId) ? route.params.empId : "");
    const [ fullName, setFullName ] = useState((route.params.fullName) ? route.params.fullName : "");
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");
    const [ isNew, setIsNew ] = useState((route.params.isNew) ? route.params.isNew : "");

    useEffect(() => {
        if (isNew) {
            navigation.setOptions({
                headerTitle: "Add User"
            });
        } else {
            navigation.setOptions({
                headerTitle: "Edit User"
            });
        }
    }, [navigation]);

    return(
        <ScrollView style={styles.container}>
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
                    placeholder="Enter a full name."
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
                            if (!fullName || !empId) {
                                Alert.alert("Invalid field.", "Please enter a full name or employee ID.")
                            }
                            else if (result && isNew) {
                                
                                Alert.alert("User already exists.", "Please find and edit/delete existing user.")
                            }
                            else if (fullName && empId) { 
                                writeUserData(empId.trim(), fullName.trim()) 
                                
                                if (isNew) {
                                    Alert.alert("Success", "User created successfully!")
                                    navigation.navigate('ManageUsers', {
                                        currUser: currUser
                                    }) 
                                } else {
                                    Alert.alert("Success", "User edited successfully!")
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
                        Alert.alert(
                            "Are you sure you want to delete this user?",
                            "Deleting this user will log you out and permanently remove this user's existing data.",
                            [
                                {
                                    text: "DELETE",
                                    onPress: () => {
                                        deleteUser(empId);
                                        navigation.popToTop();
                                    },
                                },
                                {
                                    text: "CANCEL",
                                }
                            ],
                        )
                    } else {
                        Alert.alert(
                            "Are you sure you want to delete this user?",
                            "Deleting this user will permanently remove this user's existing data.",
                            [
                                {
                                    text: "DELETE",
                                    onPress: () => {
                                        deleteUser(empId);
                                        navigation.goBack();
                                    },
                                },
                                {
                                    text: "CANCEL",
                                }
                            ],
                        )
                    }
                }}
            />
        </ScrollView>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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