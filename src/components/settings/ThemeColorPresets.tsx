import React, { ReactNode, useMemo } from 'react';
import { alpha, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import useSettings from '@/hooks/useSettings';
import ComponentsOverride from '@/theme/overrides';

type Props = {
  children: ReactNode;
};

export default function ThemeColorPresets({ children }: Props) {
  const outerTheme = useTheme(); // Dùng để lấy font, spacing, shape,...
  const { setColor } = useSettings();

  const theme = useMemo(() => {
    const theme = createTheme({
      palette: {
        ...outerTheme.palette,
        primary: setColor,
      },
      shape: outerTheme.shape,
      spacing: outerTheme.spacing,
      typography: outerTheme.typography,
      breakpoints: outerTheme.breakpoints,
      direction: outerTheme.direction,
      zIndex: outerTheme.zIndex,
      shadows: outerTheme.shadows,
    });

    theme.components = ComponentsOverride(theme);

    return theme;
  }, [setColor, outerTheme]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
