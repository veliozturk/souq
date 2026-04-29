import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ListingStackParamList } from './types';
import Start from '../screens/listing/Start';
import Photos from '../screens/listing/Photos';
import DetailsVoice from '../screens/listing/DetailsVoice';
import VoiceListening from '../screens/listing/VoiceListening';
import VoiceTranscriptReview from '../screens/listing/VoiceTranscriptReview';
import VoiceSuggestions from '../screens/listing/VoiceSuggestions';
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
        <Stack.Screen name="ListingDetails" component={DetailsVoice} />
        <Stack.Screen
          name="ListingVoiceListening"
          component={VoiceListening}
          options={{ presentation: 'transparentModal', animation: 'fade' }}
        />
        <Stack.Screen name="ListingVoiceTranscript" component={VoiceTranscriptReview} />
        <Stack.Screen name="ListingVoiceSuggestions" component={VoiceSuggestions} />
        <Stack.Screen name="ListingCategory" component={Category} />
        <Stack.Screen name="ListingPrice" component={Price} />
        <Stack.Screen name="ListingPreview" component={Preview} />
      </Stack.Navigator>
    </ListingDraftProvider>
  );
}
