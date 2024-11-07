import {
  findClosestTailwindColor,
  getInvertedColor,
  hexToRgb,
  RGB,
  rgbToHex,
} from "@/utils/twColors";
import { argv } from "process";
import { createCanvas, loadImage } from "canvas";

console.log(argv);

const path = argv[2];

if (!path) {
  console.warn("No path involve!!! Please try with command 'dominant [path]'!");
}

const getImageData = async (src: string) => {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");
  const img = await loadImage(src);

  canvas.height = img.height;
  canvas.width = img.width;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height).data;
};

const getAverage = (data: Uint8ClampedArray): RGB => {
  const gap = 40;
  const amount = data.length / gap;
  const rgb = { r: 0, g: 0, b: 0 };

  for (let i = 0; i < data.length; i += gap) {
    rgb.r += data[i];
    rgb.g += data[i + 1];
    rgb.b += data[i + 2];
  }

  return [
    Math.round(rgb.r / amount),
    Math.round(rgb.g / amount),
    Math.round(rgb.b / amount),
  ];
};

getImageData(path)
  .then(getAverage)
  .then((val) => {
    if (!Array.isArray(val)) {
      throw new Error("Something wrong");
    } else {
      const [twColor, rgb] = findClosestTailwindColor(val);
      const convertedColorRGB = hexToRgb(
        getInvertedColor(rgbToHex(rgb as RGB)) || ""
      );
      if (!convertedColorRGB) {
        throw new Error("Cannot convert color " + rgb);
      }
      const [convertedTwColor, convertRgb] =
        findClosestTailwindColor(convertedColorRGB);
      console.log(
        `[success] for path [${path}]:\n
          dominant color is: [${twColor}] (${rgb})\n
          inverted color is: [${convertedTwColor}] (${convertRgb})\n`
      );
    }
  })
  .catch((e) => console.error(e));
