import localFont from 'next/font/local';

import { cn } from './utils';

const geistMono = localFont({
 src: '../fonts/GeistMonoVF.woff',
 variable: '--font-geist-mono',
});

const geistSans = localFont({
 src: '../fonts/GeistVF.woff',
 variable: '--font-geist-sans',
});

export const silkSerif = localFont({
 src: [
  { path: '../fonts/Silk Serif Light.woff2', style: 'normal', weight: '300' },
  {
   path: '../fonts/Silk Serif Light Italic.woff2',
   style: 'italic',
   weight: '300',
  },
  { path: '../fonts/Silk Serif SemiBold.woff2', style: 'normal', weight: '600' },
  {
   path: '../fonts/Silk Serif SemiBold Italic.woff2',
   style: 'italic',
   weight: '600',
  },
  { path: '../fonts/Silk Serif Bold.woff2', style: 'normal', weight: '700' },
  {
   path: '../fonts/Silk Serif Bold Italic.woff2',
   style: 'italic',
   weight: '700',
  },
 ],
 variable: '--font-silk-serif',
});

export const fontVariables = cn(
 geistMono.variable,
 geistSans.variable,
 silkSerif.variable
);
