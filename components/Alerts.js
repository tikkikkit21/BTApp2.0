import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { getAlerts } from "../controllers/alertController";

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);

    // load alerts from API
    useEffect(() => {
        async function fetchAlerts() {
            const alertsData = await getAlerts();
            setAlerts(alertsData);
        }
        fetchAlerts();
    }, []);

    return (<Text>jon has big arms</Text>);
}
