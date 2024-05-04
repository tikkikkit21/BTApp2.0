import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { getAllBuses } from "./controllers/busController";
import { getColor } from "./controllers/routeController";

export default function Map() {
    const [buses, setBuses] = useState([]);
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.227468937500895,
        longitude: -80.42357646125542,
        latitudeDelta: 0.051202637986392574,
        longitudeDelta: 0.03720943536600885,
    });
    const refreshTimer = useRef(null);
    const [isOnCooldown, setIsOnCooldown] = useState(false);

    // load bus locations
    async function loadBuses() {
        const busData = await getAllBuses();

        // add color property
        for (bus of busData) {
            bus.color = await getColor(bus.RouteShortName);
        }

        setBuses(busData);
    }

    // auto-refresh bus locations on live map on a set interval
    useEffect(() => {
        loadBuses();
        refreshTimer.current = setInterval(() => {
            loadBuses();
        }, 30 * 1000);

        return () => {
            clearInterval(refreshTimer.current);
        };
    }, []);

    // handles when refresh button is clicked, 5s cooldown
    function handleRefreshClick() {
        if (!isOnCooldown) {
            clearInterval(refreshTimer.current);
            refreshTimer.current = setInterval(loadBuses, 10000);

            loadBuses();

            setIsOnCooldown(true);
            setTimeout(() => {
                setIsOnCooldown(false);
            }, 5000);
        }
    }

    const markers = buses.map((bus, index) => {
        return (
            <Marker
                key={index}
                coordinate={{
                    latitude: bus.Latitude,
                    longitude: bus.Longitude
                }}
                title={bus.RouteShortName}
                description={`Last stop: ${bus.LastStopName}`}
                pointerEvents="auto"
            >
                <View>
                    <FontAwesome6 name="bus-simple" size={30} color={bus.color} />
                </View>
            </Marker>
        );
    });

    return (<>
        <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={(region) => setMapRegion(region)}
            showsUserLocation={true}
        >
            {markers}
        </MapView>
        <View style={styles.refreshButton}>
            <TouchableOpacity onPress={handleRefreshClick}>
                <FontAwesome name="refresh" size={24} color="white" />
            </TouchableOpacity>
        </View>
    </>);
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    refreshButton: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: '#861F41',
        padding: 13,
        borderRadius: 15
    },
});
