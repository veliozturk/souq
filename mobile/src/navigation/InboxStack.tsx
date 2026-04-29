import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { InboxStackParamList } from './types';
import Inbox from '../screens/inbox/Inbox';
import Chat from '../screens/inbox/Chat';
import Offers from '../screens/inbox/Offers';
import ItemDetail from '../screens/browse/ItemDetail';

const Stack = createNativeStackNavigator<InboxStackParamList>();

export function InboxStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InboxList" component={Inbox} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Offers" component={Offers} />
      <Stack.Screen name="ItemDetail" component={ItemDetail} />
    </Stack.Navigator>
  );
}
