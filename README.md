# Cat Food Calculator

This repository contains a simple calculator for determining a cat's maintenance energy requirements (MER). The
original version is a static HTML page backed by a small Node test suite. A React Native version built with the
Expo framework is also included in the `expo-app` directory.

## Running the Web Version

Open `index.html` in a browser. The JavaScript logic lives in `calculator.js` and is tested with Jest.
Run the tests with:

```bash
npm test
```

## Running the React Native Version

The React Native app shares the same calculation logic and persists the entered values. Data is stored in the app's
document directory which is backed up to iCloud on iOS and by the auto backup system on Android.

Navigate to the `expo-app` folder and start Expo:

```bash
cd expo-app
npx expo start
```

This requires the Expo CLI and dependencies installed locally.
