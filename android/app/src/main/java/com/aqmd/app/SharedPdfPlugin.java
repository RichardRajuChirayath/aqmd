package com.aqmd.app;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.content.SharedPreferences;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "SharedPdf")
public class SharedPdfPlugin extends Plugin {

    @PluginMethod
    public void getSharedPdf(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences("AQMD_PREFS", getContext().MODE_PRIVATE);
        
        String data = prefs.getString("shared_pdf_data", null);
        String name = prefs.getString("shared_pdf_name", null);
        long timestamp = prefs.getLong("shared_pdf_timestamp", 0);
        
        if (data != null && name != null) {
            JSObject ret = new JSObject();
            ret.put("data", data);
            ret.put("name", name);
            ret.put("timestamp", timestamp);
            call.resolve(ret);
        } else {
            call.resolve(null);
        }
    }

    @PluginMethod
    public void clearSharedPdf(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences("AQMD_PREFS", getContext().MODE_PRIVATE);
        prefs.edit()
            .remove("shared_pdf_data")
            .remove("shared_pdf_name")
            .remove("shared_pdf_timestamp")
            .apply();
        call.resolve();
    }
}
