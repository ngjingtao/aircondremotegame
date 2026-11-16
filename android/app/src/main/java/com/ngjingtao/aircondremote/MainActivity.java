package com.ngjingtao.aircondremote;

import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private SystemTts systemTts;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        /* BridgeActivity creates the WebView in super.onCreate. Hand the page a
           native TTS engine, so narration does not depend on the WebView's own
           speechSynthesis (which is unreliable on Android). */
        WebView web = getBridge().getWebView();
        if (web != null) {
            systemTts = new SystemTts(this, web);
            web.addJavascriptInterface(systemTts, "AndroidTts");
        }
    }

    @Override
    public void onDestroy() {
        if (systemTts != null) {
            systemTts.shutdown();
            systemTts = null;
        }
        super.onDestroy();
    }
}
