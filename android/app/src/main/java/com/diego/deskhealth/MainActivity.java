package com.diego.deskhealth;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        // Polyfill for Notification API which is missing in Android WebView but might be expected by the web app
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            webView.evaluateJavascript(
                "if (typeof window.Notification === 'undefined') {" +
                "  window.Notification = {" +
                "    requestPermission: function() { return Promise.resolve('denied'); }," +
                "    permission: 'denied'" +
                "  };" +
                "  console.log('Polyfilled window.Notification');" +
                "}", null);
        }
    }
}
