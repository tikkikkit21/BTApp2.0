import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { StackActions } from '@react-navigation/native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { getAlerts } from "../controllers/alertController";

export default function Alerts({ navigation, route }) {
    const [alerts, setAlerts] = useState([]);
    const [specificAlert, setSpecificAlert] = useState();

    // load alerts from API
    useEffect(() => {
        async function fetchAlerts() {
            const alertsData = await getAlerts();
            if (alertsData.length > 0) {
                setAlerts(alertsData);
            }
        }
        fetchAlerts();
    }, []);

    useEffect(() => {
        if (route?.params?.alert) {
            setSpecificAlert(route.params.alert);
        }
    }, []);

    function goToAlert(alert) {
        navigation.dispatch(StackActions.push("alerts", { alert }))
    }

    function processList(listString) {
        const items = listString.split(",");
        const newline = "\n • "

        return newline + items.join(newline);
    }

    const alertViews = alerts.map(alert => {
        return (
            <TouchableOpacity key={alert.AlertID} onPress={() => goToAlert(alert)}>
                <View style={styles.alertSection}>
                    <View style={styles.alertText}>
                        <MaterialCommunityIcons name="alert" size={30} color="black" />
                        <Text style={styles.alertTitle}>{alert.AlertTitle}</Text>
                    </View>
                    <AntDesign name="right" />
                </View>
            </TouchableOpacity>
        );
    });

    if (specificAlert) {
        return (
            <View style={alertStyles.container}>
                <View style={alertStyles.header}>
                    <Text style={alertStyles.alertTitle}>{specificAlert.AlertTitle}</Text>
                    <MaterialCommunityIcons name="alert" size={30} color="black" />
                </View>
                <Text style={alertStyles.alertDescription}>{specificAlert.AlertMessage}</Text>
                {specificAlert.AffectedRoutesTripsStops &&
                    <Text style={alertStyles.alertAffected}>Affected Routes/Stops: {processList(specificAlert.AffectedRoutesTripsStops)}</Text>
                }
            </View>
        );
    }

    if (alerts.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.loading}>Loading alerts...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {alertViews}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 50
    },
    loading: {
        fontSize: 25,
        marginTop: 20,
        alignSelf: "center"
    },
    alertSection: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    alertText: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    alertTitle: {
        fontSize: 20,
        flex: 1,
        marginLeft: 5
    },
    alertDescription: {
        fontSize: 10
    }
});

const alertStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        justifyContent: "space-between"
    },
    alertTitle: {
        fontSize: 25
    },
    alertDescription: {
        paddingVertical: 10,
        fontSize: 17
    },
    alertAffected: {
        fontSize: 17
    }
});
