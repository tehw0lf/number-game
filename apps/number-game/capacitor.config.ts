import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.tehwolf',
  appName: 'number-game',
  webDir: '../../dist/apps/number-game/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
