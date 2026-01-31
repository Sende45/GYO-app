import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gyospa.app',
  appName: 'GYO SPA',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Affiche le logo pendant 3 secondes
      launchAutoHide: true,
      backgroundColor: "#000000", // Mets ici la couleur de ton fond (ex: noir)
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#D4AF37", // Un beau doré pour le chargement
    },
  },
};

export default config;

