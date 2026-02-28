# ============================================================
# AUSTA Healthcare SuperApp — ProGuard/R8 rules
# MASVS-CODE-1: Code obfuscation for Android release builds
# ============================================================

# --- React Native Core ---
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# --- Hermes Engine (RN 0.73+ default) ---
-keep class com.facebook.hermes.unicode.** { *; }
-dontwarn com.facebook.hermes.**

# --- Expo Modules ---
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

# --- App Package ---
-keep class br.com.austa.** { *; }

# --- MMKV (encrypted storage) ---
-keep class com.tencent.mmkv.** { *; }
-keepclassmembers class com.tencent.mmkv.MMKV { *; }

# --- react-native-device-info ---
-keep class com.learnium.RNDeviceInfo.** { *; }
-dontwarn com.learnium.RNDeviceInfo.**

# --- react-native-biometrics ---
-keep class com.rnbiometrics.** { *; }
-dontwarn com.rnbiometrics.**

# --- react-native-reanimated ---
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**

# --- react-native-gesture-handler ---
-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.gesturehandler.**

# --- react-native-screens ---
-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**

# --- react-native-svg ---
-keep class com.horcrux.svg.** { *; }
-dontwarn com.horcrux.svg.**

# --- OkHttp (used by RN networking) ---
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# --- Firebase (analytics + crashlytics) ---
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# --- Sentry ---
-keep class io.sentry.** { *; }
-dontwarn io.sentry.**

# --- JSC (fallback for non-Hermes builds) ---
-keep class org.webkit.** { *; }
-dontwarn org.webkit.**

# --- General Android ---
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes Exceptions

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable implementations
-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}

# Remove log statements in release
-assumenosideeffects class android.util.Log {
    public static int v(...);
    public static int d(...);
    public static int i(...);
}
