// @type
import { defaultSettings } from '@/config';
import useLocalStorage from '@/hooks/useLocalStorage';
import { SettingsContextProps } from '@/settings/type';
import { createContext, ReactNode, useEffect } from 'react';
// config

const initialState: SettingsContextProps = {
 ...defaultSettings,
   // Mode
   onToggleMode: () => {},
   onChangeMode: () => {},
 
   // Direction
   onToggleDirection: () => {},
   onChangeDirection: () => {},
   onChangeDirectionByLang: () => {},
 
   // Layout
   onToggleLayout: () => {},
   onChangeLayout: () => {},
 
   // Contrast
   onToggleContrast: () => {},
   onChangeContrast: () => {},
 
   // Color
   onChangeColor: () => {},
   setColor: defaultPreset,
   colorOption: [],
 
   // Stretch
   onToggleStretch: () => {},
 
   // Reset
   onResetSetting: () => {},
}


const SettingsContext = createContext(initialState);
// ----------------------------------------------------------------------

type SettingsProviderProps = {
  children: ReactNode;
};
function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useLocalStorage('settings', {
    themeMode: initialState.themeMode,
    themeLayout: initialState.themeLayout,
    themeStretch: initialState.themeStretch,
    themeContrast: initialState.themeContrast,
    themeDirection: initialState.themeDirection,
    themeColorPresets: initialState.themeColorPresets,
  });

  const isArabic = localStorage.getItem('i18nextLng') === 'ar';

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang('ar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);
}