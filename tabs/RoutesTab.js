import React, { useMemo, useRef, useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export default function RoutesTab() {
    const snapPoints = useMemo(() => ['27%', '50%', '70%', '95%'], []);
    const bottomSheetRef = useRef(null);

    // const handleSheetChanges = useCallback((index) => {
    //     console.log('handleSheetChanges', index);
    // }, []);


    return (
        <BottomSheet
            ref={bottomSheetRef}
            // onChange={handleSheetChanges}
            snapPoints={snapPoints}
        >
            {/* <BottomSheetView style={styles.contentContainer}>
                <Text>This is the routes list</Text>
            </BottomSheetView> */}
            <Text>This is the routes list</Text>
        </BottomSheet>
    );

}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: 'grey',
    },
    contentContainer: {
        alignItems: 'center',
    },
});
