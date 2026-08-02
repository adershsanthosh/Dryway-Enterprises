import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const translations = {
  en: {
    shopCatalog: 'Shop Catalog',
    wishlist: 'Wishlist',
    myOrders: 'My Orders',
    myProfile: 'My Account Settings',
    helpCenter: 'Help Center',
    adminPortal: 'Admin Portal',
    login: 'Login',
    signUp: 'Sign Up',
    logout: 'Logout',
    loyaltyPoints: 'Loyalty Points',
    searchPlaceholder: 'Search healthy snacks, dry fruits, spices...',
    allCategories: 'All Categories',
    addToBag: 'Add to Cart',
    addedToCart: 'Added to Cart',
    viewDetails: 'View Details',
    checkout: 'Checkout',
    itemsInCart: 'Items in Cart',
    grandTotal: 'Grand Total',
    redeemPoints: 'Redeem Loyalty Points',
    earnPoints: 'Points Earned',
    customerReviews: 'Customer Reviews & Ratings',
    writeReview: 'Write a Review',
    askQuestion: 'Ask a Question',
    questionsAnswers: 'Questions & Answers',
    faqs: 'Frequently Asked Questions',
    contactSupport: 'Contact Customer Support',
    saveChanges: 'Save Changes',
  },
  hi: {
    shopCatalog: 'दुकान कैटलॉग',
    wishlist: 'विशलिस्ट',
    myOrders: 'मेरे ऑर्डर',
    myProfile: 'खाता सेटिंग्स',
    helpCenter: 'सहायता केंद्र',
    adminPortal: 'एडमिन पोर्टल',
    login: 'लॉग इन',
    signUp: 'साइन अप',
    logout: 'लॉग आउट',
    loyaltyPoints: 'रॉयल्टी पॉइंट्स',
    searchPlaceholder: 'हेल्दी स्नैक्स, ड्राई फ्रूट्स खोजें...',
    allCategories: 'सभी श्रेणियां',
    addToBag: 'कार्ट में जोड़ें',
    addedToCart: 'कार्ट में जोड़ा गया',
    viewDetails: 'विवरण देखें',
    checkout: 'चेकआउट',
    itemsInCart: 'कार्ट में सामान',
    grandTotal: 'कुल योग',
    redeemPoints: 'रॉयल्टी पॉइंट्स भुनाएं',
    earnPoints: 'अर्जित पॉइंट्स',
    customerReviews: 'ग्राहक समीक्षाएं और रेटिंग',
    writeReview: 'समीक्षा लिखें',
    askQuestion: 'प्रश्न पूछें',
    questionsAnswers: 'प्रश्न और उत्तर',
    faqs: 'अक्सर पूछे जाने वाले प्रश्न',
    contactSupport: 'ग्राहक सहायता संपर्क',
    saveChanges: 'परिवर्तन सहेजें',
  },
  ml: {
    shopCatalog: 'ഉൽപ്പന്നങ്ങൾ',
    wishlist: 'വിഷ്‌ലിസ്റ്റ്',
    myOrders: 'എന്റെ ഓർഡറുകൾ',
    myProfile: 'അക്കൗണ്ട് ക്രമീകരണങ്ങൾ',
    helpCenter: 'സഹായ കേന്ദ്രം',
    adminPortal: 'അഡ്മിൻ പോർട്ടൽ',
    login: 'ലോഗിൻ',
    signUp: 'സൈൻ അപ്പ്',
    logout: 'ലോഗ് ഔട്ട്',
    loyaltyPoints: 'ലോയൽറ്റി പോയിന്റുകൾ',
    searchPlaceholder: 'ഉൽപ്പന്നങ്ങൾ തിരയുക...',
    allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
    addToBag: 'കാർട്ടിലേക്ക് ചേർക്കുക',
    addedToCart: 'കാർട്ടിൽ ചേർത്തു',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    checkout: 'ചെക്കൗട്ട്',
    itemsInCart: 'കാർട്ടിലെ ഇനങ്ങൾ',
    grandTotal: 'ആകെ തുക',
    redeemPoints: 'പോയിന്റുകൾ ഉപയോഗിക്കുക',
    earnPoints: 'ലഭിച്ച പോയിന്റുകൾ',
    customerReviews: 'കസ്റ്റമർ റിവ്യൂകൾ',
    writeReview: 'അഭിപ്രായം രേഖപ്പെടുത്തുക',
    askQuestion: 'ചോദ്യം ചോദിക്കുക',
    questionsAnswers: 'ചോദ്യങ്ങളും ഉത്തരങ്ങളും',
    faqs: 'ചോദ്യോത്തരങ്ങൾ',
    contactSupport: 'സഹായത്തിന് ബന്ധപ്പെടുക',
    saveChanges: 'സേവ് ചെയ്യുക',
  },
  ta: {
    shopCatalog: 'கடைகள்',
    wishlist: 'விருப்பப்பட்டியல்',
    myOrders: 'என் ஆர்டர்கள்',
    myProfile: 'கணக்கு அமைப்புகள்',
    helpCenter: 'உதவி மையம்',
    adminPortal: 'நிர்வாக போர்டல்',
    login: 'உள்நுழைவு',
    signUp: 'பதிவு செய்க',
    logout: 'வெளியேறு',
    loyaltyPoints: 'ராயல்டி புள்ளிகள்',
    searchPlaceholder: 'பொருட்களைத் தேடுங்கள்...',
    allCategories: 'அனைத்து பிரிவுகளும்',
    addToBag: 'கூடையில் சேர்',
    addedToCart: 'கூடையில் சேர்க்கப்பட்டது',
    viewDetails: 'விவரங்களைக் காண்க',
    checkout: 'பணம் செலுத்துகை',
    itemsInCart: 'கூடையில் உள்ள பொருட்கள்',
    grandTotal: 'மொத்த தொகை',
    redeemPoints: 'புள்ளிகளைப் பயன்படுத்து',
    earnPoints: 'பெற்ற புள்ளிகள்',
    customerReviews: 'வாடிக்கையாளர் விமர்சனங்கள்',
    writeReview: 'விமர்சனம் எழுதுங்கள்',
    askQuestion: 'கேள்வி கேட்க',
    questionsAnswers: 'கேள்விகள் & பதில்கள்',
    faqs: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    contactSupport: 'உதவிக்கு தொடர்பு கொள்ளவும்',
    saveChanges: 'சேமிக்க',
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(
    localStorage.getItem('dryway_lang') || 'en'
  );

  useEffect(() => {
    localStorage.setItem('dryway_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
