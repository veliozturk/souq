import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ListingStackParamList } from './types';
import Start from '../screens/listing/Start';
import Photos from '../screens/listing/Photos';
import Details from '../screens/listing/Details';
import Category from '../screens/listing/Category';
import Price from '../screens/listing/Price';
import Preview from '../screens/listing/Preview';
import { ListingDraftProvider } from '../screens/listing/ListingDraftContext';

const Stack = createNativeStackNavigator<ListingStackParamList>();

export function ListingStack() {
  return (
    <ListingDraftProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ListingStart" component={Start} />
        <Stack.Screen name="ListingPhotos" component={Photos} />
        <Stack.Screen name="ListingDetails" component={Details} />
        <Stack.Screen name="ListingCategory" component={Category} />
        <Stack.Screen name="ListingPrice" component={Price} />
        <Stack.Screen name="ListingPreview" component={Preview} />
      </Stack.Navigator>
    </ListingDraftProvider>
  );
}
