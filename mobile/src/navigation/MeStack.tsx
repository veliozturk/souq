import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MeStackParamList } from './types';
import MeProfile from '../screens/me/Profile';
import MyListings from '../screens/me/MyListings';
import ListingAdmin from '../screens/me/ListingAdmin';

const Stack = createNativeStackNavigator<MeStackParamList>();

export function MeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MeProfile" component={MeProfile} />
      <Stack.Screen name="MyListings" component={MyListings} />
      <Stack.Screen name="ListingAdmin" component={ListingAdmin} />
    </Stack.Navigator>
  );
}
