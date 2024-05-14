import React from 'react';
import Map from './Map';
import RoutesTab from './tabs/RoutesTab';
import PlanATripTab from './tabs/PlanATripTab';

export default function Main({ route }) {
    return (<>
        <Map />
        {route.params.index === 1 && <RoutesTab />}
        {route.params.index === 2 && <PlanATripTab />}
    </>);
}
