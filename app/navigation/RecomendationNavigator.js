import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import RecomendationScreen from '../screens/RecomendationScreen';


const Stack = createStackNavigator();

const AccountNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name = "Account" component={RecomendationScreen}/>
    </Stack.Navigator>
)

export default AccountNavigator;