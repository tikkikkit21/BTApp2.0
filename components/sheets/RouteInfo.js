import React, { useState, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import { getRoute } from "../../controllers/routeController";

export default function RouteInfo({ bus, canShow }) {
    const [route, setRoute] = useState({});
    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);
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
                <Text style={{ ...styles.title, color: bus.color }}>{bus.RouteShortName} #{bus.AgencyVehicleName}</Text>
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    title: {
        fontSize: 20
    }
});
