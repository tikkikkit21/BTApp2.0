import React, { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Entypo, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
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

    function renderTabBar(props) {
        return (
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: 'white' }}
                style={{ backgroundColor: 'pink' }}
                renderIcon={({ route, focused, color }) => {
                    console.log("route:", route)
                    console.log("focused:", focused)
                    switch (route.key) {
                        case "home":
                            return <Entypo name="map" size={24} color={color} />
                        case "routes":
                            return <FontAwesome6 name="route" size={24} color={color} />
                        case "plan":
                            return <FontAwesome5 name="map-marked-alt" size={24} color={color} />
                        case "settings":
                            return <FontAwesome6 name="gear" size={24} color={color} />
                    }
                }}
            />
        );
    }

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
                renderTabBar={renderTabBar}
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
