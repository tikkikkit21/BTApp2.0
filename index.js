import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import App from './App';

function Root() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <App />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

registerRootComponent(Root);
