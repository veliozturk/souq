import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import Welcome from '../screens/auth/Welcome';
import Phone from '../screens/auth/Phone';
import OTP from '../screens/auth/OTP';
import Profile from '../screens/auth/Profile';
import Location from '../screens/auth/Location';
import Success from '../screens/auth/Success';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Phone" component={Phone} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="Success" component={Success} />
    </Stack.Navigator>
  );
}
