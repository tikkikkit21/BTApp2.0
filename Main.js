import React from 'react';
import Map from './Map';
import RoutesTab from './tabs/RoutesTab';
import PlanATripTab from './tabs/PlanATripTab';

export default function Main({ route, index }) {
    console.log("route:", route.params.data)
    return (<>
        <Map />
        {index === 1 && <RoutesTab />}
        {index === 2 && <PlanATripTab />}
    </>);
}
