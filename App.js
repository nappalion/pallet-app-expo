import * as React from 'react';
import { Button } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HeaderBackButton } from '@react-navigation/elements'

import LandingScreen from './screens/LandingScreen'
import CalculateScreen from './screens/CalculateScreen'
import ResultsScreen from './screens/ResultsScreen'
import LoginScreen from './screens/LoginScreen'
import BarcodeScreen from './screens/BarcodeScreen'
import ManagePalletScreen from './screens/admin/ManagePalletScreen';
import ManageUsersScreen from './screens/admin/ManageUsersScreen';
import EditPalletScreen from './screens/admin/EditCreatePalletScreen';
import EditUserScreen from './screens/admin/EditCreateUserScreen';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="Barcode"
          component={BarcodeScreen}
          options={({navigation, route}) => ({
            headerRight: () => (
              <Button title="Open Form"/>
            ),
            headerTitle: "Scan Item"
          })}
        />
        <Stack.Screen
          name="Calculate"
          component={CalculateScreen}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ 
            headerLeft: () => ( <HeaderBackButton />),
            headerTitle: "" 
          }}
        />
        <Stack.Screen
          name="ManagePallet"
          component={ManagePalletScreen}
          options={{ headerTitle: "Manage Pallets" }}
        />
        <Stack.Screen
          name="ManageUsers"
          component={ManageUsersScreen}
          options={{ headerTitle: "Manage Users" }}
        />
        <Stack.Screen
          name="EditCreatePallet"
          component={EditPalletScreen}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="EditCreateUser"
          component={EditUserScreen}
          options={{ headerTitle: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
