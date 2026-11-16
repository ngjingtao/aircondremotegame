package com.ngjingtao.aircondremote;

import android.annotation.SuppressLint;
import android.content.Context;
import android.media.AudioAttributes;
import android.os.Build;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import java.util.Locale;

/**
 * SystemTts — Android's own text-to-speech engine, exposed to the web app.
 *
 * The WebView's speechSynthesis is unreliable on Android: many devices report no
 * voices, and some never start an utterance. This class talks to
 * android.speech.tts.TextToSpeech instead, so the app uses the same voice the
 * rest of the phone uses — and it works with the screen's normal media volume.
 *
 * The page sees it as window.AndroidTts:
 *   AndroidTts.speak(text, "zh-CN", 0.92) -> utterance id ("" if unavailable)
 *   AndroidTts.stop()
 *   AndroidTts.isReady()
 *
 * While it speaks it calls back into shared/voice.js:
 *   ARG.voice._nativeStart(id)          speech started
 *   ARG.voice._nativeRange(id, s, e)    a word was spoken (Android 8+)
 *   ARG.voice._nativeDone(id)           speech finished
 *   ARG.voice._nativeError(id)          the engine refused it
 */
@SuppressLint("NewApi")
public class SystemTts implements TextToSpeech.OnInitListener {

    private final WebView webView;

    private TextToSpeech tts;
    private volatile boolean ready = false;
    private volatile boolean failed = false;
    private volatile boolean released = false;

    private String pendingText = null;
    private String pendingId = null;
    private String langTag = "zh-CN";
    private float rate = 0.92f;
    private int seq = 0;

    public SystemTts(Context context, WebView webView) {
        this.webView = webView;
        this.tts = new TextToSpeech(context.getApplicationContext(), this);
    }

    @Override
    public synchronized void onInit(int status) {
        if (released) return;
        if (status != TextToSpeech.SUCCESS) {
            failed = true;
            call("ARG.voice&&ARG.voice._nativeError&&ARG.voice._nativeError('')");
            return;
        }

        ready = true;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            tts.setAudioAttributes(new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build());
        }
        applyLanguage(langTag);
        tts.setSpeechRate(rate);

        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override
            public void onStart(String utteranceId) {
                call("ARG.voice&&ARG.voice._nativeStart&&ARG.voice._nativeStart('" + utteranceId + "')");
            }

            @Override
            public void onDone(String utteranceId) {
                call("ARG.voice&&ARG.voice._nativeDone&&ARG.voice._nativeDone('" + utteranceId + "')");
            }

            @Override
            public void onError(String utteranceId) {
                call("ARG.voice&&ARG.voice._nativeError&&ARG.voice._nativeError('" + utteranceId + "')");
            }

            @Override
            public void onRangeStart(String utteranceId, int start, int end, int frame) {
                call("ARG.voice&&ARG.voice._nativeRange&&ARG.voice._nativeRange('" + utteranceId + "',"
                        + start + "," + end + ")");
            }
        });

        /* a tap can arrive before the engine finishes starting */
        if (pendingText != null) {
            String text = pendingText;
            String id = pendingId;
            pendingText = null;
            pendingId = null;
            speakNow(text, id);
        }
    }

    @JavascriptInterface
    public boolean isReady() {
        return ready && !failed && !released;
    }

    @JavascriptInterface
    public synchronized String speak(String text, String language, float speechRate) {
        if (failed || released || text == null) return "";
        String body = text.trim();
        if (body.length() == 0) return "";

        if (language != null && language.length() > 0) langTag = language;
        if (speechRate > 0f) rate = speechRate;

        if (ready && tts != null) {
            applyLanguage(langTag);
            tts.setSpeechRate(rate);
        }

        String id = "u" + (++seq);
        if (!ready) {
            /* remember only the newest request; a child tapping twice wants the
               second sentence, not a queue of both */
            pendingText = body;
            pendingId = id;
            return id;
        }

        speakNow(body, id);
        return id;
    }

    @JavascriptInterface
    public synchronized void stop() {
        pendingText = null;
        pendingId = null;
        if (ready && tts != null) tts.stop();
    }

    /** called from MainActivity.onDestroy, never from the page */
    public synchronized void shutdown() {
        released = true;
        pendingText = null;
        pendingId = null;
        if (tts != null) {
            try { tts.stop(); } catch (Exception ignored) {}
            try { tts.shutdown(); } catch (Exception ignored) {}
            tts = null;
        }
    }

    private void speakNow(String text, String id) {
        if (tts == null || released) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, id);
        } else {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
        }
    }

    private void applyLanguage(String tag) {
        if (tts == null) return;
        Locale want;
        try {
            want = Locale.forLanguageTag(tag == null ? "zh-CN" : tag);
        } catch (Exception e) {
            want = Locale.SIMPLIFIED_CHINESE;
        }

        int result = tts.setLanguage(want);
        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            Locale fallback = "zh".equals(want.getLanguage()) ? Locale.SIMPLIFIED_CHINESE : Locale.US;
            tts.setLanguage(fallback);
        }
    }

    private void call(String js) {
        if (webView == null || released) return;
        webView.post(() -> {
            if (released) return;
            try {
                webView.evaluateJavascript(js, null);
            } catch (Exception ignored) {
                /* the WebView can be gone between post() and this runnable */
            }
        });
    }
}
