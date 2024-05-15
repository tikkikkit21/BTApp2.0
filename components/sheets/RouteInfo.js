import React, { useState, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome6 } from "@expo/vector-icons"
import { getRoute } from "../../controllers/routeController";

export default function RouteInfo({ bus, canShow }) {
    const [route, setRoute] = useState({});
    const snapPoints = useMemo(() => ['50%', '95%'], []);
    const bottomSheetRef = useRef(null);

    // fetch route data for the bus
    useEffect(() => {
        async function fetchRoute() {
            const routeData = await getRoute(bus.RouteShortName);
            setRoute(routeData);
        }

        fetchRoute();
    }, [bus]);

    useEffect(() => {
        if (canShow === false) {
            bottomSheetRef.current.close();
        }
        else {
            bottomSheetRef.current.snapToIndex(0);
        }
    });

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <FontAwesome6 name="bus-simple" size={30} color={bus.color} />
                    <Text style={{ ...styles.title, color: bus.color }}>{route.RouteName}</Text>
                </View>
                <View style={styles.body}>
                    <Text>Capacity: {bus.PercentOfCapacity}%</Text>
                    <Text>Bus ID: {bus.AgencyVehicleName}</Text>
                    <Text>Last Stop: {bus.LastStopName} (#{bus.StopCode})</Text>
                </View>
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    header: {
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        fontSize: 30,
        marginLeft: 10
    },
    body: {
        marginTop: 10
    }
});
