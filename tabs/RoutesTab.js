import React, { useState, useMemo, useRef, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
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

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
        >
            <BottomSheetFlatList
                data={routes}
                keyExtractor={(_, index) => index}
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
});
