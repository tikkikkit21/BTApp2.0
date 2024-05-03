import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from 'react-native-maps';

export default function Map() {
    return (
        <MapView
            style={styles.map}
        />
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});
