import * as React from 'react';
import { Button } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
        />
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
        />
        <Stack.Screen
          name="Barcode"
          component={BarcodeScreen}
          options={({navigation, route}) => ({
            headerRight: () => (
              <Button title="Open Form"/>
            )
          })}
        />
        <Stack.Screen
          name="Calculate"
          component={CalculateScreen}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
        />
        <Stack.Screen
          name="ManagePallet"
          component={ManagePalletScreen}
        />
        <Stack.Screen
          name="ManageUsers"
          component={ManageUsersScreen}
        />
        <Stack.Screen
          name="EditCreatePallet"
          component={EditPalletScreen}
        />
        <Stack.Screen
          name="EditCreateUser"
          component={EditUserScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
