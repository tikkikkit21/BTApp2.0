import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome, FontAwesome5, FontAwesome6, Octicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import RouteInfo from "./sheets/RouteInfo";
import { getAllBuses } from "../controllers/api/busController";
import { getColor, getRoutePolyline } from "../controllers/api/routeController";
import { getAlerts } from "../controllers/api/alertController";
import { saveUsageDataRecord } from "../controllers/user/aiController";

const BURRUSS_COORDS = {
    latitude: 37.227468937500895,
    longitude: -80.42357646125542,
    latitudeDelta: 0.051202637986392574,
    longitudeDelta: 0.03720943536600885,
}

export default function Map({ navigation }) {
    const [buses, setBuses] = useState([]);
    const [routeCoords, setRouteCoords] = useState([]);
    const [currBus, setCurrBus] = useState(null);
    const [canShow, setCanShow] = useState(false);

    const [alerts, setAlerts] = useState([]);
    const [mapRegion, setMapRegion] = useState(BURRUSS_COORDS);
    const refreshTimer = useRef(null);
    const [isOnCooldown, setIsOnCooldown] = useState(false);

    // fetch bus locations
    async function fetchBuses() {
        const busData = await getAllBuses();

        // add color property
        for (bus of busData) {
            bus.color = await getColor(bus.RouteShortName);
        }

        setBuses(busData);
    }

    // fetch alerts
    useEffect(() => {
        async function fetchAlerts() {
            const alertsData = await getAlerts();
            setAlerts(alertsData);
        }
        fetchAlerts();
    }, []);

    // auto-refresh bus locations on live map on a set interval
    useEffect(() => {
        fetchBuses();
        refreshTimer.current = setInterval(() => {
            fetchBuses();
        }, 30 * 1000);

        return () => {
            clearInterval(refreshTimer.current);
        };
    }, []);

    // handles when refresh button is clicked, 5s cooldown
    function handleRefreshClick() {
        if (!isOnCooldown) {
            clearInterval(refreshTimer.current);
            refreshTimer.current = setInterval(fetchBuses, 10000);

            fetchBuses();

            setIsOnCooldown(true);
            setTimeout(() => {
                setIsOnCooldown(false);
            }, 5000);
        }
    }

    // when alert button is clicked, navigate to alerts page
    function handleAlertClick() {
        navigation.navigate("alerts");
    }

    // create bus icons
    function createBusMarkers() {
        return buses.map((bus, index) => {
            return (
                <Marker
                    key={index}
                    coordinate={{
                        latitude: bus.Latitude,
                        longitude: bus.Longitude
                    }}
                    pointerEvents="auto"
                    onSelect={() => handleSelect(bus)}
                    onDeselect={handleDeselect}
                >
                    <View>
                        <FontAwesome6 name="bus-simple" size={30} color={bus.color} />
                    </View>
                </Marker>
            );
        });
    }

    // handlers for bus select/deselect
    async function handleSelect(bus) {
        const poly = await getRoutePolyline(bus.PatternName);
        setRouteCoords(poly);
        setCurrBus(bus);
        setCanShow(true);
        setMapRegion(prevRegion => {
            return {
                ...prevRegion,
                latitude: bus.Latitude - 0.023,
                longitude: bus.Longitude
            };
        });

        // save data record
        const location = await Location.getCurrentPositionAsync({});
        await saveUsageDataRecord({
            route: bus.RouteShortName,
            coords:
            {
                lat: location.coords.latitude,
                long: location.coords.longitude
            },
            time: new Date()
        });
    }

    async function handleDeselect() {
        setCanShow(false);
    }

    // create stop markers
    function createStopMarkers() {
        return routeCoords
            .filter(stop => stop.IsBusStop === "Y")
            .map(stop => {
                const icon = stop.IsTimePoint === "Y"
                    ? <FontAwesome name="star" size={20} color={currBus?.color || "black"} />
                    : <Octicons name="dot-fill" size={30} color={currBus?.color || "black"} />;

                return <Marker
                    key={stop.Rank}
                    coordinate={{
                        latitude: stop.Latitude,
                        longitude: stop.Longitude
                    }}
                    title={String(stop.StopCode)}
                    description={stop.StopName}
                    pointerEvents="auto"
                >
                    <View>
                        {icon}
                    </View>
                </Marker>
            });
    }

    // create route line
    function createRouteLine() {
        const coords = routeCoords.map(c => {
            return {
                latitude: c.Latitude,
                longitude: c.Longitude
            };
        });

        return <Polyline
            coordinates={coords}
            strokeColor={currBus?.color || "black"}
            strokeWidth={3}
        />;
    }

    return (<>
        <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={(region) => setMapRegion(region)}
            showsUserLocation={true}
        >
            {createBusMarkers()}
            {createStopMarkers()}
            {createRouteLine()}
        </MapView>
        {currBus && <RouteInfo
            bus={currBus}
            canShow={canShow}
            onClose={handleDeselect}
        />}
        <View style={styles.refreshButton}>
            <TouchableOpacity
                style={styles.mapButton}
                onPress={handleRefreshClick}
            >
                <FontAwesome name="refresh" size={24} color="white" />
            </TouchableOpacity>
        </View>
        {alerts.length > 0 &&
            <View style={styles.alertButton}>
                <TouchableOpacity
                    style={styles.mapButton}
                    onPress={handleAlertClick}
                >
                    <FontAwesome5 name="bell" size={24} color="white" />
                </TouchableOpacity>
            </View>
        }
    </>);
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    mapButton: {
        backgroundColor: '#861F41',
        padding: 13,
        borderRadius: 50
    },
    refreshButton: {
        position: 'absolute',
        top: 50,
        right: 10
    },
    alertButton: {
        position: 'absolute',
        top: 110,
        right: 10
    },
});
