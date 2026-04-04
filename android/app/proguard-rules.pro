# Add project specific ProGuard rules here.
# For more details, see:
#   http://developer.android.com/guide/developing/tools/proguard.html

# ---- Capacitor core ----
-keep class com.getcapacitor.** { *; }
-keepnames class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }

# ---- Capacitor Local Notifications ----
-keep class com.capacitorjs.plugins.localnotifications.** { *; }

# ---- Capacitor plugins (cordova bridge) ----
-keep class com.getcapacitor.plugin.** { *; }

# ---- WebView JavaScript Interface ----
# Keep any class that is annotated as a JS interface so R8 doesn't strip bridge methods.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ---- AndroidX / Support ----
-keep class androidx.core.app.** { *; }
-keep class androidx.core.content.** { *; }

# ---- AndroidX Activity Result API (used in MainActivity for runtime permissions) ----
-keep class androidx.activity.result.** { *; }
-keep class androidx.activity.result.contract.** { *; }

# ---- AndroidX SplashScreen ----
-keep class androidx.core.splashscreen.** { *; }

# ---- Preserve line numbers for crash reports ----
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ---- Suppress warnings for missing classes in optional deps ----
-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**
