import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.tehwolf',
  appName: 'number-game',
  webDir: '../../dist/apps/number-game/browser',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
