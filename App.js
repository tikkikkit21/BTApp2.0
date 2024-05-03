import React, { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import RoutesTab from './tabs/RoutesTab';

const renderScene = SceneMap({
    home: () => null,
    routes: () => <RoutesTab />,
    plan: () => null,
    settings: () => null
});

export default function App() {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = useState([
        { key: 'home', title: 'Home' },
        { key: 'routes', title: 'Routes' },
        { key: 'plan', title: 'Plan a Trip' },
        { key: 'settings', title: 'Settings' },
    ]);

    return (
        <View style={styles.container}>
            <Text>
                This is the background text
            </Text>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                tabBarPosition='bottom'
                swipeEnabled={false}
                animationEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 50
    },
});
