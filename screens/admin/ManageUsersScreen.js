import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from "react-native";
import Button from '../../components/Button';
import SubHeader from '../../components/SubHeader';
import TextInput from '../../components/TextInput';

import { database } from "../../firebaseConfig.js"
import { ref, child, onValue } from "firebase/database";
import ListItem from '../../components/ListItem';

const sortByName = (data) => {
    return data.sort((a, b) => {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
    });
}

const ManageUsersScreen = ({ route, navigation }) => {
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");
    const [ search, setSearch ] = useState("");
    const [ users, setUsers ] = useState(null);
    const [ filteredUsers, setFilteredUsers ] = useState(null);

    useEffect(() => {
        onValue(ref(database, 'users'), (snapshot) => {
            var result = [];
            if (snapshot.exists()) {
              Object.entries(snapshot.val()).forEach((item) => {
                result.push({name: item[1].name, number: item[0]})
              })
              setUsers(sortByName(result));
              setFilteredUsers(sortByName(result));
            } else {
              console.log("Users not found.")
            }
        });
    }, []);

    useEffect(() => {
        if (users) {
            var temp = [];
            users.forEach((user, index) => {
                if (user.name.toLowerCase().includes(search.toLowerCase()) || user.number.includes(search)) {
                    temp.push(user);
                }
            })
            setFilteredUsers(temp);
        }
    }, [search]);
    

    const renderItem = ({ item, index}) => (
        <ListItem
            name={item.name} 
            number={item.number}
            onPress={() => navigation.navigate("EditCreateUser", {
                empId: item.number,
                fullName: item.name,
                currUser: currUser
            })}
        />
    )

    return(
        <View style={styles.container}>
            <TextInput 
                placeholder="Search Name or ID" 
                search
                style={styles.search}
                value={search}
                onChangeText={(text) => { setSearch(text); }}
            />
            <Button 
                style={styles.button}
                text="ADD USER" 
                onPress={() => {
                    navigation.navigate("EditCreateUser", {
                        currUser: currUser,
                        isNew: true
                    })
                }}
            />
            <SubHeader 
                title="Name" 
                secondTitle="Employee ID"
            />

            <FlatList
                data={ (search) ? filteredUsers : users }
                renderItem={renderItem}
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

export default ManageUsersScreen;