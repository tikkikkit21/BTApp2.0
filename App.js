import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RoutesTab from './tabs/RoutesTab';

export default function App() {
    const [tab, setTab] = useState("");

    return (
        <View style={styles.container}>
            <Text>
                This is the background text
            </Text>
            {tab === "routes" && <RoutesTab />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 50
    },
});
