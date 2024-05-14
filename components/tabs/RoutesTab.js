import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons"
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { getCurrentRoutes } from "../../controllers/routeController";

export default function RoutesTab() {
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
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
        const color = `#${bus.RouteColor}`;
        return (
            <View style={styles.routeItem}>
                <View style={styles.label}>
                    <FontAwesome6 name="bus-simple" size={30} color={color} />
                    <View style={styles.labelText}>
                        <Text style={{ ...styles.labelTitle, color }}>{bus.RouteShortName}</Text>
                        <Text style={{ ...styles.labelDescription, color }}>{bus.RouteName}</Text>
                    </View>
                </View>
                <AntDesign name="right" size={24} color="gray" />
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
    routeItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10
    },
    label: {
        flexDirection: "row",
        alignItems: "center"
    },
    labelText: {
        marginLeft: 10
    },
    labelTitle: {
        fontSize: 20
    },
    labelDescription: {
        fontSize: 15
    },
});
