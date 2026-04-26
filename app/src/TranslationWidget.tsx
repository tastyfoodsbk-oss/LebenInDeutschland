import React, { useEffect } from 'react';

export const TranslationWidget: React.FC = () => {
  useEffect(() => {
    // Only add if it doesn't exist
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'de', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element'
        );
      };
    }
  }, []);

  return <div id="google_translate_element"></div>;
};

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}
