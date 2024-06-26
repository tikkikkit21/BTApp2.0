import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Entypo, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import Map from './components/Map';
import Alerts from './components/Alerts';
import RoutesTab from './components/sheets/RoutesList';
import PlanATripTab from './components/sheets/PlanATrip';

const Stack = createNativeStackNavigator();

const renderScene = SceneMap({
    home: () => null,
    routes: () => null,
    plan: () => null,
    settings: () => null
});

export default function App() {
    const navigatorRef = useRef();
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
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
                indicatorStyle={{ opacity: 0 }}
                style={styles.tabBar}
                renderLabel={({ route, focused, color }) => {
                    let icon;
                    switch (route.key) {
                        case "home":
                            icon = <Entypo name="map" size={24} color={color} />;
                            break;
                        case "routes":
                            icon = <FontAwesome6 name="route" size={24} color={color} />;
                            break;
                        case "plan":
                            icon = <FontAwesome5 name="map-marked-alt" size={24} color={color} />;
                            break;
                        case "settings":
                            icon = <FontAwesome6 name="gear" size={24} color={color} />
                            break;
                    }

                    return (
                        <View style={styles.label}>
                            {icon}
                            <Text style={{ color: color }}>{route.title}</Text>
                        </View>
                    );
                }}
                onTabPress={() => { navigatorRef.current?.navigate("home"); }}
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <NavigationContainer
                    ref={navigatorRef}
                >
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: "white"
                            }
                        }}
                    >
                        <Stack.Screen name="home" component={Map} />
                        <Stack.Screen name="alerts" component={Alerts} />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
            {index === 1 && <RoutesTab />}
            {index === 2 && <PlanATripTab />}
            <View style={styles.tabContainer}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        height: "90%"
    },
    tabContainer: {
        height: '10%'
    },
    tabBar: {
        backgroundColor: '#861F41',
        height: "100%"
    },
    label: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
