package com.aqmd.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "AQMD_Share";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register custom plugin
        registerPlugin(SharedPdfPlugin.class);

        handleIncomingIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    private void handleIncomingIntent(Intent intent) {
        if (intent == null)
            return;

        String action = intent.getAction();
        String type = intent.getType();

        Log.d(TAG, "Received intent - Action: " + action + ", Type: " + type);

        // Handle shared PDF
        if (Intent.ACTION_SEND.equals(action) && "application/pdf".equals(type)) {
            Uri pdfUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
            if (pdfUri != null) {
                Log.d(TAG, "PDF URI: " + pdfUri.toString());
                handleSharedPDF(pdfUri);
            }
        }
    }

    private void handleSharedPDF(Uri pdfUri) {
        try {
            android.widget.Toast.makeText(this, "[DEBUG] Processing PDF...", android.widget.Toast.LENGTH_SHORT).show();

            // Read PDF file as base64
            InputStream inputStream = getContentResolver().openInputStream(pdfUri);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            byte[] pdfBytes = outputStream.toByteArray();
            String base64Pdf = Base64.encodeToString(pdfBytes, Base64.NO_WRAP);

            // Get filename
            String fileName = "shared.pdf";
            String[] projection = { android.provider.OpenableColumns.DISPLAY_NAME };
            android.database.Cursor cursor = getContentResolver().query(pdfUri, projection, null, null, null);
            if (cursor != null && cursor.moveToFirst()) {
                int nameIndex = cursor.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME);
                fileName = cursor.getString(nameIndex);
                cursor.close();
            }

            inputStream.close();
            outputStream.close();

            Log.d(TAG, "PDF loaded successfully: " + fileName + " (" + pdfBytes.length + " bytes)");
            android.widget.Toast.makeText(this, "[DEBUG] Loaded: " + fileName, android.widget.Toast.LENGTH_LONG).show();

            // Store in shared preferences for web app to retrieve
            getSharedPreferences("AQMD_PREFS", MODE_PRIVATE)
                    .edit()
                    .putString("shared_pdf_data", "data:application/pdf;base64," + base64Pdf)
                    .putString("shared_pdf_name", fileName)
                    .putLong("shared_pdf_timestamp", System.currentTimeMillis())
                    .apply();

            Log.d(TAG, "Stored in SharedPreferences");
            android.widget.Toast.makeText(this, "[DEBUG] Navigating to /study...", android.widget.Toast.LENGTH_SHORT)
                    .show();

            // Load the study page
            getBridge().getWebView().post(() -> {
                getBridge().getWebView().evaluateJavascript(
                        "window.location.href = '/study?shared=true';",
                        null);
            });

        } catch (Exception e) {
            Log.e(TAG, "Error handling shared PDF", e);
            android.widget.Toast.makeText(this, "[ERROR] " + e.getMessage(), android.widget.Toast.LENGTH_LONG).show();
        }
    }

}
