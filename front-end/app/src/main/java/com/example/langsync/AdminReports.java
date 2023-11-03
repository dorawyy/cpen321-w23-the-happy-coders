package com.example.langsync;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class AdminReports extends AppCompatActivity {

    private static final String TAG = "AdminReports";
    private RecyclerView reportsRecyclerView;
    private List<JSONObject> reports = new ArrayList<>();

    // ChatGPT Usage: No
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_reports);

        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        String adminId = sharedPreferences.getString("loggedUserId", null);

        JSONObject first = new JSONObject();
        try {
            first.put("isFirst", true);
            reports.add(first);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(getString(R.string.base_url) + "moderation/" + adminId)
                .get()
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                e.printStackTrace();
                Log.d(TAG, "Error getting reports");
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                String responseBody = response.body().string();
                Log.d(TAG, responseBody);
                try {
                    JSONObject jsonObject = new JSONObject(responseBody);
                    JSONArray reportsObj = jsonObject.getJSONArray("reports");
                    for (int i = 0; i < reportsObj.length(); i++) {
                        reportsObj.getJSONObject(i).put("isFirst", false);
                        reports.add(reportsObj.getJSONObject(i));
                    }
                    runOnUiThread(() -> {
                        reportsRecyclerView = findViewById(R.id.reports_recycler_view);

                        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());
                        reportsRecyclerView.setLayoutManager(layoutManager);

                        RecyclerView.Adapter chatRecyclerAdapter = new ReportsRecyclerAdapter(AdminReports.this, getApplicationContext(), reports, adminId);

                        reportsRecyclerView.setAdapter(chatRecyclerAdapter);
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });


    }
}