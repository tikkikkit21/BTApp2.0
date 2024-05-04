import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons"
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { getCurrentRoutes } from "../controllers/routeController";

export default function RoutesTab() {
    const snapPoints = useMemo(() => ['25%', '50%', '75%', '100%'], []);
    const bottomSheetRef = useRef(null);
    const [routes, setRoutes] = useState([]);

    // load in routes
    useEffect(() => {
        async function fetchRoutes() {
            const routeData = await getCurrentRoutes();
            setRoutes(routeData);
        }
        fetchRoutes();
    }, []);

    // renders route data into pretty React components
    const renderItem = useCallback(({ item: bus }) => {
        console.log("item:", bus);
        return (
            <View style={styles.routeContainer}>
                <FontAwesome6 name="bus-simple" size={30} color={bus.color} />
                <View>
                    <Text>{bus.RouteShortName}</Text>
                    <Text>{bus.RouteName}</Text>
                </View>
                <AntDesign name="right" size={24} color="black" />
            </View>
        );
    }, []);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
        >
            <BottomSheetFlatList
                data={routes}
                keyExtractor={(_, index) => index}
                renderItem={renderItem}
            />
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: 'grey',
    },
    contentContainer: {
        alignItems: 'center',
    },
    routeContainer: {

    }
});
