import palette from "./palette";

export const colorPresets = [
  // DEFAULT
  {
    name: "default",
    ...palette.light.primary,
  },
  // CYAN
  {
    name: "cyan",
    lighter: "#D1FFFC",
    light: "#76F2FF",
    main: "#1CCAFF",
    dark: "#0E77B7",
    darker: "#053D7A",
    contrastText: palette.light.grey[800],
  },
  // BLUE
  {
    name: "blue",
    lighter: "#D1E9FC",
    light: "#76B0F1",
    main: "#2065D1",
    dark: "#103996",
    darker: "#061B64",
    contrastText: "#fff",
  },
  // ORANGE
  {
    name: "orange",
    lighter: "#FEF4D4",
    light: "#FED680",
    main: "#fda92d",
    dark: "#B66816",
    darker: "#793908",
    contrastText: palette.light.grey[800],
  },
  // RED
  {
    name: "red",
    lighter: "#FFE3D5",
    light: "#FFC1AC",
    main: "#FF3030",
    dark: "#B71833",
    darker: "#7A0930",
    contrastText: "#fff",
  },
];

export const defaultPreset = colorPresets[0];
export const purplePreset = colorPresets[1];
export const cyanPreset = colorPresets[2];
export const bluePreset = colorPresets[3];
export const orangePreset = colorPresets[4];
export const redPreset = colorPresets[5];