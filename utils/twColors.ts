import defaultColors from "tailwindcss/colors";

export type Hex = string;
export type RGB = [r: number, g: number, b: number];

// Function to calculate inverted color
export function getInvertedColor(hex: Hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const invertedRgb = rgb.map((value) => 255 - value) as RGB;
  return rgbToHex(invertedRgb);
}

// Helper function to convert RGB to hex
export function rgbToHex(rgb: RGB) {
  const [r, g, b] = rgb;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Helper function to convert hex to RGB
export function hexToRgb(hex: string): RGB | null {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return match
    ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)]
    : null;
}

// Helper function to calculate Euclidean distance
function calculateDistance(rgb1: RGB, rgb2: RGB) {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

// Function to find the closest Tailwind color
export function findClosestTailwindColor(dynamicRgb: RGB) {
  let closestColorLabel = "";
  let smallestDistance = Infinity;
  let targetColor = "white";
  let targetRgb: RGB = [255, 255, 255];

  for (const [color, value] of Object.entries(defaultColors)) {
    if (typeof value !== "string") {
      for (const [label, hex] of Object.entries(value) as [string, string][]) {
        const rgb = hexToRgb(hex);
        if (rgb) {
          const distance = calculateDistance(dynamicRgb, rgb);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestColorLabel = label;
            targetColor = color;
            targetRgb = rgb;
          }
        }
      }
    }
  }

  return [
    closestColorLabel ? `${targetColor}-${closestColorLabel}` : targetColor,
    targetRgb,
  ];
}
