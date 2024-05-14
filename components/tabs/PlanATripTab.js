import React, { useMemo, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';

export default function PlanAStrip() {
    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);
    const bottomSheetRef = useRef(null);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
        >
            <Text>This is the plan a trip tab</Text>
        </BottomSheet>
    );
}
