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
  { path: '../fonts/Silk Serif Light.otf', style: 'normal', weight: '300' },
  {
   path: '../fonts/Silk Serif Light Italic.otf',
   style: 'italic',
   weight: '300',
  },
  { path: '../fonts/Silk Serif SemiBold.otf', style: 'normal', weight: '600' },
  {
   path: '../fonts/Silk Serif SemiBold Italic.otf',
   style: 'italic',
   weight: '600',
  },
  { path: '../fonts/Silk Serif Bold.otf', style: 'normal', weight: '700' },
  {
   path: '../fonts/Silk Serif Bold Italic.otf',
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
