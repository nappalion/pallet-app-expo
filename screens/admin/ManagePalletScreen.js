import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from "react-native";
import Button from '../../components/Button';
import ListItem from '../../components/ListItem';
import SubHeader from '../../components/SubHeader';
import TextInput from '../../components/TextInput';

import { database } from "../../firebaseConfig.js"
import { ref, child, onValue } from "firebase/database";

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

const ManagePalletScreen = ({ route, navigation }) => {
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");
    const [ search, setSearch ] = useState("");
    const [ pallets, setPallets ] = useState(null);
    const [ filteredPallets, setFilteredPallets ] = useState(null);

    useEffect(() => {
        onValue(ref(database, 'barcodes'), (snapshot) => {
            var result = [];
            if (snapshot.exists()) {
              Object.entries(snapshot.val()).forEach((item) => {
                result.push({
                    name: item[1].name, 
                    number: item[0], 
                    dimensions: {
                        "length": item[1].length, 
                        "width": item[1].width,
                        "height": item[1].height
                    }})
              })
              setPallets(sortByName(result));
              setFilteredPallets(sortByName(result));
            } else {
              console.log("Pallets not found.");
            }
        });
    }, [])

    useEffect(() => {
        if (pallets) {
            var temp = [];
            pallets.forEach((pallet, index) => {
                console.log(search);
                if (pallet.name.toLowerCase().includes(search.toLowerCase()) || pallet.number.includes(search)) {
                    temp.push(pallet);
                }
            })
            setFilteredPallets(temp);
        }
    }, [search])

    const renderItem = ({ item, index}) => (
        <ListItem
            name={item.name} 
            number={item.number}
            onPress={() => navigation.navigate("EditCreatePallet", {
                empId: item.number,
                itemName: item.name,
                barcode: item.number,
                dimensions: item.dimensions,
                currUser: currUser,
            })}
        />
    )

    return(
        <View style={styles.container}>
            <TextInput 
                placeholder="Search Name or Barcode" 
                search
                style={styles.search}
                value={search}
                onChangeText={(text) => { setSearch(text); }}
            />
            <Button 
                style={styles.button}
                onPress={() => {
                    navigation.navigate("EditCreatePallet", {
                        currUser: currUser,
                        isNew: true
                    })
                }}
                text="ADD PALLET" 
            />
            <SubHeader 
                title="Item Name" 
                secondTitle="Barcode Number"
            />
            <FlatList
                data={ (search) ? filteredPallets : pallets }
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

export default ManagePalletScreen;