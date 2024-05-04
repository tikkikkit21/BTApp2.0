import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from 'react-native-maps';

export default function Map() {
    const [mapRegion, setMapRegion] = useState({
        latitude: 37.227468937500895,
        longitude: -80.42357646125542,
        latitudeDelta: 0.051202637986392574,
        longitudeDelta: 0.03720943536600885,
    });

    return (
        <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={(region) => setMapRegion(region)}
            showsUserLocation={true}
        />
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '90%',
    },
});
