import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BrowseStackParamList } from './types';
import Home from '../screens/browse/Home';
import CategoryResults from '../screens/browse/CategoryResults';
import ItemDetail from '../screens/browse/ItemDetail';
import SellerProfile from '../screens/browse/SellerProfile';

const Stack = createNativeStackNavigator<BrowseStackParamList>();

export function BrowseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BrowseHome" component={Home} />
      <Stack.Screen name="CategoryResults" component={CategoryResults} />
      <Stack.Screen name="ItemDetail" component={ItemDetail} />
      <Stack.Screen name="SellerProfile" component={SellerProfile} />
    </Stack.Navigator>
  );
}
