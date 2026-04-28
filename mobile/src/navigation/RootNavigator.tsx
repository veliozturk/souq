import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { useAuthStub } from '../auth/AuthStub';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import SendMessage from '../modals/SendMessage';
import MakeOffer from '../modals/MakeOffer';
import CounterOffer from '../modals/CounterOffer';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthed, hydrating } = useAuthStub();
  if (hydrating) return null;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthed ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="SendMessage"
            component={SendMessage}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="MakeOffer"
            component={MakeOffer}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="CounterOffer"
            component={CounterOffer}
            options={{
              presentation: 'transparentModal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
