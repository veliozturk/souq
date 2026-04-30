import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MeStackParamList } from './types';
import MeProfile from '../screens/me/Profile';
import MyListings from '../screens/me/MyListings';
import ListingAdmin from '../screens/me/ListingAdmin';
import EditListing from '../screens/me/EditListing';
import EditPhotos from '../screens/me/EditPhotos';
import Appearance from '../screens/me/Appearance';
import EditProfile from '../screens/me/EditProfile';
import LocationPicker from '../screens/browse/LocationPicker';

const Stack = createNativeStackNavigator<MeStackParamList>();

export function MeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MeProfile" component={MeProfile} />
      <Stack.Screen name="MyListings" component={MyListings} />
      <Stack.Screen name="ListingAdmin" component={ListingAdmin} />
      <Stack.Screen name="EditListing" component={EditListing} />
      <Stack.Screen name="EditPhotos" component={EditPhotos} />
      <Stack.Screen name="Appearance" component={Appearance} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="LocationPicker" component={LocationPicker} />
    </Stack.Navigator>
  );
}
