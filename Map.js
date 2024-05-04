import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome6 } from '@expo/vector-icons';
import { getAllBuses } from "./controllers/busController";

export default function Map() {
    const [buses, setBuses] = useState([]);
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.227468937500895,
        longitude: -80.42357646125542,
        latitudeDelta: 0.051202637986392574,
        longitudeDelta: 0.03720943536600885,
    });

    // load bus locations
    useEffect(() => {
        async function loadBuses() {
            const busData = await getAllBuses();
            setBuses(busData);
        }

        loadBuses();
    }, []);

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
                    <FontAwesome6 name="bus-simple" size={30} color="black" />
                </View>
            </Marker>
        );
    });

    return (
        <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={(region) => setMapRegion(region)}
            showsUserLocation={true}
        >
            {markers}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});
