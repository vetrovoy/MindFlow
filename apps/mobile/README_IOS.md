# MindFlow Mobile - iOS Runbook (macOS)

This document describes how to build and run the MindFlow mobile app on iOS using a Mac.

## Prerequisites

### System Requirements

- **OS:** macOS 12.0+ (Monterey or later)
- **Node.js:** >= 22.11.0 (recommended: use nvm or fnm)
- **pnpm:** 10.6.5+
- **Xcode:** 15.0+ (latest stable from App Store)
- **CocoaPods:** 1.14+
- **Ruby:** 3.0+ (system Ruby is sufficient)

### Xcode Setup

1. **Install Xcode** from the Mac App Store

2. **Install Xcode Command Line Tools:**
   ```bash
   xcode-select --install
   ```

3. **Accept Xcode License:**
   ```bash
   sudo xcodebuild -license accept
   ```

4. **Select Xcode:**
   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   ```

5. **Install CocoaPods:**
   ```bash
   sudo gem install cocoapods
   ```

6. **Install iOS Simulator:**
   - Open Xcode → Settings → Components
   - Download iOS Simulator for your target iOS version

## Quick Start

### 1. Install Dependencies

From the project root (`MindFlow/`):

```bash
pnpm install
```

### 2. Install CocoaPods Dependencies

```bash
cd apps/mobile/ios
pod install
cd ../..
```

> **Note:** Run `pod install` every time you update native iOS dependencies.

### 3. Start Metro Bundler

```bash
pnpm mobile:start
```

This starts the Metro development server on `http://localhost:8081`.

### 4. Run on iOS Simulator

```bash
pnpm mobile:ios
```

This command:
- Builds the iOS app
- Opens the iOS Simulator
- Installs and launches MindFlow

### 5. Run on Specific Simulator

```bash
pnpm mobile:ios --simulator="iPhone 15 Pro"
```

Available simators:
```bash
xcrun simctl list devices available
```

## Manual iOS Build

### Open in Xcode

```bash
cd apps/mobile/ios
open MindFlow.xcworkspace
```

> **Important:** Always open `.xcworkspace` (not `.xcodeproj`) after running `pod install`.

### Build from Xcode

1. Select target device/simulator from the device dropdown
2. Press `Cmd + R` to build and run
3. Or: Product → Run

### Archive for Distribution

1. Select "Any iOS Device (arm64)" as build target
2. Product → Archive
3. Use Organizer to distribute to TestFlight or App Store

## Running on Physical Device

### Setup

1. **Connect your iPhone/iPad** via USB or Wi-Fi

2. **Trust the device** on your Mac when prompted

3. **Select your device** in Xcode device dropdown

4. **Configure Signing:**
   - Open `MindFlow.xcworkspace` in Xcode
   - Select MindFlow target → Signing & Capabilities
   - Select your Team (Apple Developer account required)
   - Update Bundle Identifier if needed

5. **Run:**
   ```bash
   pnpm mobile:ios --device
   ```

### Wireless Debugging

1. Connect device via USB initially
2. In Xcode: Window → Devices and Simulators
3. Select your device → Check "Connect via network"
4. Disconnect USB - device remains available

## Troubleshooting

### "Command PhaseScriptExecution failed"

Clean build folder:
```bash
cd apps/mobile/ios
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData/MindFlow-*
```

### "No bundle URL present"

Ensure Metro is running, then:
```bash
# In apps/mobile/ios
rm -rf MindFlow.app
# Rebuild in Xcode
```

### CocoaPods errors

```bash
cd apps/mobile/ios
pod deintegrate
pod install --repo-update
```

### Metro bundler not connecting

1. Check Metro is running on port 8081
2. In simulator: Cmd + D → Debug → Enable "Debug Remote JS"
3. Reload app: Cmd + R

### Signing errors

- Ensure you're signed in to Xcode with Apple ID
- Check Team is selected in Signing & Capabilities
- For development: use Automatic Signing
- For distribution: configure certificates and profiles

### Simulator is slow

- Use a newer device type (iPhone 15 Pro)
- Disable GPU rendering issues: I/O → Graphics Quality Override
- Restart Simulator: Device → Erase All Content and Settings

### "FBSOpenApplicationError"

Reset simulator:
```bash
xcrun simctl erase all
```

### Build fails after Xcode update

```bash
# Clean everything
cd apps/mobile
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock
cd ios && pod install && cd ..

# Rebuild
pnpm mobile:ios
```

## Project Structure

```
apps/mobile/
├── ios/
│   ├── MindFlow/              # iOS source files
│   │   ├── AppDelegate.swift  # App entry point
│   │   ├── Info.plist         # App configuration
│   │   └── Images.xcassets    # App icons and assets
│   ├── MindFlow.xcworkspace   # Xcode workspace (use this!)
│   ├── MindFlow.xcodeproj     # Xcode project
│   └── Podfile                # CocoaPods dependencies
├── src/
│   └── components/
│       └── MindFlowBootstrap.tsx
├── App.tsx                    # React Native entry
├── index.js                   # Metro entry point
├── metro.config.js            # Metro configuration
└── package.json
```

## Configuration Files

### ios/MindFlow/Info.plist

Key configurations:
- `CFBundleDisplayName`: "MindFlow"
- `CFBundleIdentifier`: "com.mindflow.mobile"
- `NSAppTransportSecurity`: Allows local Metro connection

### ios/Podfile

Native dependencies:
- React Native core
- React Native CLI
- Third-party native modules

### ios/MindFlow.xcodeproj/project.pbxproj

Xcode project settings:
- Target name: "MindFlow"
- Product bundle identifier: "com.mindflow.app"
- Deployment target: iOS 15.1+

## Development Tips

### Hot Reload

- **Reload:** Cmd + R in simulator
- **Show Dev Menu:** Cmd + D
- **Enable Hot Reload:** Dev Menu → Debug → Enable Fast Refresh

### Debugging

1. **React DevTools:**
   ```bash
   npx react-devtools
   ```

2. **Chrome DevTools:**
   - Dev Menu → Debug → Open Chrome
   - Note: Requires chrome://inspect

3. **Flipper (deprecated in RN 0.84+):**
   - Use React DevTools instead

### Testing on Different iOS Versions

```bash
# List available runtimes
xcrun simctl list runtimes

# Install additional iOS versions via Xcode → Settings → Components
```

## Next Steps

After verifying iOS runs successfully:

1. Test hot reload (edit `App.tsx` and save)
2. Verify Metro bundler connection
3. Check safe area insets on notch devices
4. Test on physical device
5. Configure app icons and splash screen

## Related Documentation

- [Android Runbook](./README_ANDROID.md) - Android setup guide
- [Library Policy](./README_LIBRARY_POLICY.md) - Dependencies and tooling

## Apple Silicon (M1/M2/M3) Notes

For Macs with Apple Silicon:

1. **Rosetta 2** may be required for some native modules:
   ```bash
   softwareupdate --install-rosetta
   ```

2. **CocoaPods** on Apple Silicon:
   ```bash
   arch -arm64 pod install
   ```

3. **Xcode** runs natively on Apple Silicon (no Rosetta needed)

4. **Simulator** runs natively on Apple Silicon
