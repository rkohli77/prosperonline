/**
 * Utility functions for handling social media links with mobile app detection
 */

// Detect if the user is on a mobile device
const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Detect if the user is on iOS
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Detect if the user is on Android
const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

/**
 * Get the appropriate Facebook URL based on device and app availability
 */
export const getFacebookUrl = (): string => {
  const baseUrl = 'https://www.facebook.com/GoProsperOnline/';
  
  if (!isMobile()) {
    return baseUrl;
  }
  
  if (isIOS()) {
    // Try multiple Facebook URL schemes for iOS
    return 'fb://page/GoProsperOnline';
  }
  
  if (isAndroid()) {
    // Try to open Facebook app, fallback to web
    return 'intent://www.facebook.com/GoProsperOnline/#Intent;package=com.facebook.katana;scheme=https;end';
  }
  
  return baseUrl;
};

/**
 * Get the appropriate Instagram URL based on device and app availability
 */
export const getInstagramUrl = (): string => {
  const baseUrl = 'https://www.instagram.com/GoProsperOnline/';
  
  if (!isMobile()) {
    return baseUrl;
  }
  
  if (isIOS()) {
    // Try to open Instagram app, fallback to web
    return 'instagram://user?username=GoProsperOnline';
  }
  
  if (isAndroid()) {
    // Try to open Instagram app, fallback to web
    return 'intent://www.instagram.com/GoProsperOnline/#Intent;package=com.instagram.android;scheme=https;end';
  }
  
  return baseUrl;
};

/**
 * Handle click events for social media links with fallback
 */
export const handleSocialClick = (url: string, fallbackUrl: string) => {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // For Facebook on iOS, try multiple URL schemes
    if (isIOS() && url.includes('fb://')) {
      const facebookSchemes = [
        'fb://page/GoProsperOnline',
        'fb://profile/GoProsperOnline'
      ];
      
      let schemeIndex = 0;
      const tryNextScheme = () => {
        if (schemeIndex < facebookSchemes.length) {
          const appWindow = window.open(facebookSchemes[schemeIndex], '_blank');
          schemeIndex++;
          
          setTimeout(() => {
            if (!appWindow || appWindow.closed) {
              tryNextScheme();
            }
          }, 500);
        } else {
          // All schemes failed, fallback to web
          window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
        }
      };
      
      tryNextScheme();
      return;
    }
    
    // For other cases, use the original logic
    const appWindow = window.open(url, '_blank');
    
    // If the app doesn't open (window is null or closed immediately), fallback to web
    setTimeout(() => {
      if (!appWindow || appWindow.closed) {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1000);
  };
};

