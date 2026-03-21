# Icon Replacement Required

All image assets in `src/assets/images/` are 67-byte placeholders and must be replaced with production assets before App Store submission.

## Required Assets

| File | Current Size | Required Dimensions | Format | Usage |
|------|-------------|-------------------|--------|-------|
| logo.png | 67 bytes | 1024x1024 px | PNG (no alpha) | App Store icon, referenced in app.json `expo.icon` |
| splash.png | 67 bytes | 1284x2778 px | PNG | Launch screen, referenced in app.json `expo.splash.image` |
| adaptive-icon.png | 67 bytes | 1024x1024 px | PNG (with alpha) | Android adaptive icon foreground |
| notification-icon.png | 67 bytes | 96x96 px | PNG (monochrome, alpha only) | Push notification badge icon |
| favicon.png | 67 bytes | 48x48 px | PNG | Web favicon |

## Additional Assets Needed

| File | Dimensions | Format | Usage |
|------|-----------|--------|-------|
| icon.png | 1024x1024 px | PNG (no transparency) | iOS App Store icon (if separate from logo.png) |

## Notes

- iOS App Store icon must NOT have transparency or alpha channel
- Android adaptive icon uses `adaptive-icon.png` as foreground over `#ffffff` background (configured in app.json)
- Notification icon should be monochrome with transparency for Android
- Splash screen dimensions target iPhone 14 Pro Max; Expo handles downscaling
- `achievements/` directory contains only a README.md placeholder — achievement badge assets also needed

## Action Required

Design team must provide production-quality assets matching the specifications above. Once received, replace files in `src/web/mobile/src/assets/images/`.
