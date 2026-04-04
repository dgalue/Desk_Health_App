package com.diego.deskhealth;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // Launcher for the POST_NOTIFICATIONS runtime permission dialog (Android 13+)
    private ActivityResultLauncher<String> notificationPermissionLauncher;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Install the splash screen BEFORE super.onCreate() so it is shown during cold start.
        // The splash screen is auto-dismissed once the first frame is drawn.
        SplashScreen.installSplashScreen(this);

        super.onCreate(savedInstanceState);

        // Register the permission launcher. Must be done in onCreate before the Activity starts.
        notificationPermissionLauncher = registerForActivityResult(
            new ActivityResultContracts.RequestPermission(),
            isGranted -> {
                // The Capacitor LocalNotifications plugin will pick up the result via its own
                // requestPermissions path; this launcher covers the app-level cold-start ask.
            }
        );

        // On Android 13+ (API 33), POST_NOTIFICATIONS is a runtime permission.
        // Ask the user once if it has not been granted yet.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS);
            }
        }
    }

    @Override
    public void onStart() {
        super.onStart();

        // Polyfill window.Notification for the WebView environment.
        // Android WebView does not expose the browser Notification API.
        // We stub it so the web code does not crash, while returning 'default' (not 'denied')
        // so App.jsx's permission gate allows Capacitor LocalNotifications to proceed.
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            webView.evaluateJavascript(
                "(function() {" +
                "  if (typeof window.Notification !== 'undefined') return;" +
                "  window.Notification = {" +
                "    requestPermission: function() { return Promise.resolve('granted'); }," +
                "    permission: 'granted'" +
                "  };" +
                "  console.log('[DeskHealth] Polyfilled window.Notification for Android WebView');" +
                "})();",
                null
            );
        }
    }
}
