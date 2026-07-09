import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.johmicrocredit.app',
  appName: 'Joh Microcredit',
  webDir: 'dist',
  server: {
    // Replace <YOUR_IP> with your computer's IP address.
    // Remove this for production builds.
    url: 'http://192.168.1.100:3000',
    cleartext: true
  }
};

export default config;
