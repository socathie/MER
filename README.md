# MER Cat Food Calculator

This repository contains two parts:

1. **Web Calculator** - A static HTML page (`index.html`) that uses `calculator.js` for calculating
   a cat's metabolic energy requirement (MER). Jest tests live in the `tests` directory.
2. **React Native App** - Located in `rn-cat-food`, it offers the same MER calculation in a simple
   mobile interface and stores data to iCloud using `react-native-icloudstore`.

## Running Tests

Run the test suite with:

```bash
npm test
```

The tests cover the calculation functions in `calculator.js`.

## React Native App

Install dependencies inside `rn-cat-food` and run the app with the standard
React Native workflow. Cat information will be saved to iCloud so it can be
restored across devices.
