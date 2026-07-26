import { createContext, useContext, useState, useCallback } from 'react';

const ShopBrandingContext = createContext({
  shopName: '',
  shopLogo: '',
  shopAddress: '',
  shopEmail: '',
  shopPhone: '',
  shopDescription: '',
  setShopBranding: () => {},
  clearShopBranding: () => {},
});

export function ShopBrandingProvider({ children }) {
  const [branding, setBranding] = useState({ 
    shopName: '', 
    shopLogo: '',
    shopAddress: '',
    shopEmail: '',
    shopPhone: '',
    shopDescription: ''
  });

  const setShopBranding = useCallback((name, logo, address, email, phone, description) => {
    setBranding({ 
      shopName: name || '', 
      shopLogo: logo || '',
      shopAddress: address || '',
      shopEmail: email || '',
      shopPhone: phone || '',
      shopDescription: description || ''
    });
  }, []);

  const clearShopBranding = useCallback(() => {
    setBranding({ 
      shopName: '', 
      shopLogo: '',
      shopAddress: '',
      shopEmail: '',
      shopPhone: '',
      shopDescription: ''
    });
  }, []);

  return (
    <ShopBrandingContext.Provider value={{ ...branding, setShopBranding, clearShopBranding }}>
      {children}
    </ShopBrandingContext.Provider>
  );
}

export function useShopBranding() {
  return useContext(ShopBrandingContext);
}
