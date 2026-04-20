import React, { useState } from 'react';
import { IOSDevice } from './IOSDevice.jsx';
import {
  ScreenWelcome, ScreenPhone, ScreenOTP, ScreenProfile, ScreenLocation, ScreenSuccess,
} from './screens.jsx';
import {
  ListingStart, ListingPhotos, ListingDetails, ListingCategory, ListingPrice, ListingPreview,
} from './listing.jsx';
import {
  BrowseHome, CategoryResults, ItemDetail, SellerProfile, SendMessage,
} from './browse.jsx';
import {
  MyListings, ListingAdmin, MessagesInbox, ChatScreen, OffersInbox, ProfileScreen,
} from './admin.jsx';

const SIGNUP = ['welcome', 'phone', 'otp', 'profile', 'location', 'success'];
const LISTING = ['start', 'photos', 'details', 'category', 'price', 'preview'];

export default function App() {
  const [flow, setFlow] = useState('signup');
  const [step, setStep] = useState(0);
  const [browseStack, setBrowseStack] = useState(['home']);
  const [adminStack, setAdminStack] = useState(['profile']);
  const [name, setName] = useState('Aisha Al Mansouri');
  const [location, setLocation] = useState('Dubai Marina');

  const seq = flow === 'signup' ? SIGNUP : flow === 'listing' ? LISTING : null;
  const go = (i) => setStep(Math.max(0, Math.min(seq.length - 1, i)));
  const next = () => go(step + 1);
  const back = () => go(step - 1);
  const skip = () => go(step + 1);

  const switchTo = (f, i = 0) => { setFlow(f); setStep(i); };
  const startListing = () => switchTo('listing', 0);
  const returnToSuccess = () => switchTo('signup', SIGNUP.indexOf('success'));

  const openBrowse = () => { setFlow('browse'); setBrowseStack(['home']); };
  const browsePush = (s) => setBrowseStack((st) => [...st, s]);
  const browsePop = () => setBrowseStack((st) => (st.length > 1 ? st.slice(0, -1) : st));

  const adminPush = (s) => setAdminStack((st) => [...st, s]);
  const adminPop = () => setAdminStack((st) => (st.length > 1 ? st.slice(0, -1) : st));

  const handleTab = (id) => {
    if (id === 'home') { setFlow('browse'); setBrowseStack(['home']); }
    else if (id === 'sell') startListing();
    else if (id === 'msg') { setFlow('admin'); setAdminStack(['inbox']); }
    else if (id === 'me') { setFlow('admin'); setAdminStack(['profile']); }
  };

  const currentBrowse = browseStack[browseStack.length - 1];
  const currentAdmin = adminStack[adminStack.length - 1];

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', boxSizing: 'border-box',
    }}>
      <IOSDevice>
        {flow === 'signup' && seq[step] === 'welcome' && (
          <ScreenWelcome onNext={next} onLogin={() => go(1)} />
        )}
        {flow === 'signup' && seq[step] === 'phone' && (
          <ScreenPhone onNext={next} onBack={back} onSkip={skip} />
        )}
        {flow === 'signup' && seq[step] === 'otp' && (
          <ScreenOTP onNext={next} onBack={back} onSkip={skip} onChangeNumber={() => go(1)} />
        )}
        {flow === 'signup' && seq[step] === 'profile' && (
          <ScreenProfile onNext={next} onBack={back} onSkip={skip} name={name} setName={setName} />
        )}
        {flow === 'signup' && seq[step] === 'location' && (
          <ScreenLocation onNext={next} onBack={back} onSkip={skip} location={location} setLocation={setLocation} />
        )}
        {flow === 'signup' && seq[step] === 'success' && (
          <ScreenSuccess name={name} location={location} onList={startListing} onBrowse={openBrowse} />
        )}

        {flow === 'listing' && seq[step] === 'start' && (
          <ListingStart onNewListing={next} onClose={returnToSuccess} />
        )}
        {flow === 'listing' && seq[step] === 'photos' && (
          <ListingPhotos onNext={next} onBack={back} onSkip={skip} />
        )}
        {flow === 'listing' && seq[step] === 'details' && (
          <ListingDetails onNext={next} onBack={back} onSkip={skip} />
        )}
        {flow === 'listing' && seq[step] === 'category' && (
          <ListingCategory onNext={next} onBack={back} onSkip={skip} />
        )}
        {flow === 'listing' && seq[step] === 'price' && (
          <ListingPrice onNext={next} onBack={back} onSkip={skip} />
        )}
        {flow === 'listing' && seq[step] === 'preview' && (
          <ListingPreview
            onPublish={returnToSuccess}
            onBack={back}
            onSkip={skip}
            onSaveDraft={() => switchTo('listing', 0)}
          />
        )}

        {flow === 'browse' && currentBrowse === 'home' && (
          <BrowseHome
            location={location}
            onOpenItem={() => browsePush('detail')}
            onOpenCategory={() => browsePush('results')}
            onOpenSearch={() => browsePush('results')}
            onTab={handleTab}
          />
        )}
        {flow === 'browse' && currentBrowse === 'results' && (
          <CategoryResults
            onBack={browsePop}
            onOpenItem={() => browsePush('detail')}
            onTab={handleTab}
          />
        )}
        {flow === 'browse' && currentBrowse === 'detail' && (
          <ItemDetail
            onBack={browsePop}
            onSeller={() => browsePush('seller')}
            onMessage={() => browsePush('message')}
            onOffer={() => browsePush('message')}
          />
        )}
        {flow === 'browse' && currentBrowse === 'seller' && (
          <SellerProfile
            onBack={browsePop}
            onMessage={() => browsePush('message')}
          />
        )}
        {flow === 'browse' && currentBrowse === 'message' && (
          <SendMessage
            onDismiss={browsePop}
            onSend={browsePop}
            onSave={browsePop}
          />
        )}

        {flow === 'admin' && currentAdmin === 'profile' && (
          <ProfileScreen
            onMyListings={() => adminPush('listings')}
            onOffers={() => adminPush('offers')}
            onTab={handleTab}
          />
        )}
        {flow === 'admin' && currentAdmin === 'listings' && (
          <MyListings
            onBack={adminPop}
            onOpenListing={() => adminPush('listingAdmin')}
            onTab={handleTab}
          />
        )}
        {flow === 'admin' && currentAdmin === 'listingAdmin' && (
          <ListingAdmin onBack={adminPop} />
        )}
        {flow === 'admin' && currentAdmin === 'offers' && (
          <OffersInbox onBack={adminPop} />
        )}
        {flow === 'admin' && currentAdmin === 'inbox' && (
          <MessagesInbox
            onOpenChat={() => adminPush('chat')}
            onTab={handleTab}
          />
        )}
        {flow === 'admin' && currentAdmin === 'chat' && (
          <ChatScreen onBack={adminPop} />
        )}
      </IOSDevice>
    </div>
  );
}
