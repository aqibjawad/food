import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import TestScreen from '../screens/TestScreen';


const Stack = createStackNavigator();

const TestNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name = "Test" component={TestScreen}/>
    </Stack.Navigator>
)

export default TestNavigator;