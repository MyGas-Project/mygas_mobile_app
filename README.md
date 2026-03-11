
---

# mygas_mobile_app

`mygas_mobile_app` is a React Native mobile app (Expo-style) for gas station loyalty, cart, wallet, and promotions.

## 📌 Branch policy

- Main development and production deployment branch: `dev_mode` (alias `development_mode` branch in your description).
- Always clone/use this branch for active work and deploy.
- Example:
  - `git clone <repo-url>`
  - `git checkout dev_mode`

> ⚠️ Key: `dev_mode` is the branch for development and production deploys.

---

## 🗂️ Repo structure

- App.js, index.js ­– app entrypoints
- android, ios – platform projects
- src
  - `components/`, `screens/`, `context/`, `hooks/`, `service/`, etc.
- assets, credentials, `config.js`, app.json, etc.

---

## 🛠️ Pre-requisites

Install tooling:

- Node >= 18 (or project-specified)
- npm or yarn
- Java JDK + Android SDK (Android build)
- Xcode (iOS build)
- `expo-cli` or `npx expo` (if using managed Expo)
- `watchman` (macOS/Linux recommended)

---

## 📥 Clone + checkout

```bash
git clone <repository-url>
cd mygas_mobile_app
git fetch --all
git checkout dev_mode
git pull origin dev_mode
```

---

## 📦 Install dependencies

```bash
npm install
# or
yarn install
```

---

## 🚀 Development run (local)

### Option A: Expo (managed / bare)
```bash
npx expo start
```

Then:
- press `a` for Android emulator
- press `i` for iOS simulator
- scan QR code for physical device

### Option B: Android
```bash
npx react-native run-android
```

### Option C: iOS
```bash
npx pod-install ios
npx react-native run-ios
```

---

## 🧪 Build / release (common)

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
Open Xcode:
- workspace: `ios/mygas.xcworkspace`
- scheme: `mygas`
- configure signing/team
- Archive for release

---

## 🔄 Environment / config

- app.json controls Expo/settings
- config.js, configurations.js for API endpoints/keys
- google-services.json and iOS provision profiles under ios

---

## 🚨 Notes

- `dev_mode` branch is source-of-truth for both development and production releases.
- Merge flow:
  1. `feature/*` → `dev_mode`
  2. QA on `dev_mode`
  3. release from `dev_mode`
- Ensure `google-services.json` / provisioning is correct before final deploy.

---

## 🧹 Common helpers

- Notification.js, Websockets.js, etc.
- BottomNavigation.js, `Navbar.js`
- HomeScreen.js, `ActivityScreen.js`, etc.

---

## 📌 Quick summary

- Clone `dev_mode` branch
- Install deps (`npm install` / `yarn`)
- Start app (`npx expo start`)
- Production also from `dev_mode`  
- Use standard Android/iOS build flows for app-store deploy

---