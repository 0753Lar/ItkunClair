import localFont from "next/font/local";

import { Roboto, Noto_Sans } from "next/font/google";

export const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const notoSans = Noto_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const montserrat = localFont({
  src: "./fonts/Montserrat-Regular.ttf",
  weight: "100 900",
});
