import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jhyv.expensebreakdown',
  appName: 'expense-breakdown',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
