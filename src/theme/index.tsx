import React, { useMemo, ReactNode } from 'react';
// @mui
import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import useSettings from '@/components/hooks/useSettings';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import shadows, { customShadows } from './shadows';
import componentsOverride from './overrides';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const { themeMode, themeDirection } = useSettings();

  const isLight = themeMode === 'light';

  const theme = useMemo(() => {
    // Step 1: define base options
    const baseOptions: ThemeOptions = {
      palette: isLight ? palette.light : palette.dark,
      typography,
      breakpoints,
      shape: { borderRadius: 8 },
      direction: themeDirection,
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: isLight ? customShadows.light : customShadows.dark,
    };

    // Step 2: create the theme once, to pass to component overrides
    const baseTheme = createTheme(baseOptions);

    // Step 3: return final theme with components override included
    return createTheme({
      ...baseOptions,
      components: componentsOverride(baseTheme),
    });
  }, [isLight, themeDirection]);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
