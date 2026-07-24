import { createContext, useContext, useState, useCallback } from 'react';

const ShopBrandingContext = createContext({
  shopName: '',
  shopLogo: '',
  setShopBranding: () => {},
  clearShopBranding: () => {},
});

export function ShopBrandingProvider({ children }) {
  const [branding, setBranding] = useState({ shopName: '', shopLogo: '' });

  const setShopBranding = useCallback((name, logo) => {
    setBranding({ shopName: name || '', shopLogo: logo || '' });
  }, []);

  const clearShopBranding = useCallback(() => {
    setBranding({ shopName: '', shopLogo: '' });
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
