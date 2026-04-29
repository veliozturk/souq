import type { NavigatorScreenParams } from '@react-navigation/native';

// Auth stack — signup flow
export type AuthStackParamList = {
  Welcome: undefined;
  Phone: undefined;
  OTP: { phone: string };
  Profile: undefined;
  Location: undefined;
  Success: undefined;
};

// Browse stack inside HomeTab
export type BrowseStackParamList = {
  BrowseHome: undefined;
  CategoryResults: { query?: string; categoryId?: string; label?: string };
  ItemDetail: { id: string; fromConversation?: boolean };
  SellerProfile: { id: string };
  Notifications: undefined;
  LocationPicker: undefined;
};

// Listing stack — modal "create listing" wizard
export type ListingStackParamList = {
  ListingStart: undefined;
  ListingPhotos: undefined;
  ListingDetails: undefined;
  ListingCategory: undefined;
  ListingPrice: undefined;
  ListingPreview: undefined;
};

// Inbox stack
export type InboxStackParamList = {
  InboxList: undefined;
  Chat: { threadId: string };
  Offers: undefined;
  ItemDetail: { id: string; fromConversation?: boolean };
};

// Me / account stack
export type MeStackParamList = {
  MeProfile: undefined;
  MyListings: undefined;
  ListingAdmin: { id: string };
  EditListing: { id: string };
  EditPhotos: { id: string };
};

// Bottom tabs
export type MainTabsParamList = {
  HomeTab: NavigatorScreenParams<BrowseStackParamList>;
  SavedTab: undefined;
  SellTab: NavigatorScreenParams<ListingStackParamList>;
  InboxTab: NavigatorScreenParams<InboxStackParamList>;
  MeTab: NavigatorScreenParams<MeStackParamList>;
};

// Root native-stack — switches Auth vs Main; modals at root
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabsParamList>;
  SendMessage: { itemId: string; sellerId: string };
  MakeOffer: { itemId: string; sellerId: string };
  CounterOffer: {
    conversationId: string;
    originalOfferId: string;
    originalOfferAed: number;
    listedPriceAed: number;
  };
};
