package com.example.langsync;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import com.example.langsync.ui.chat.AllChatsRecyclerAdapter;
import com.example.langsync.ui.chat.ReportsRecyclerAdapter;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class AdminReports extends AppCompatActivity {

    private RecyclerView reportsRecyclerView;
    private List<JSONObject> reports = new ArrayList<>();

    // ChatGPT Usage: No
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_reports);

        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        String adminId = sharedPreferences.getString("loggedUserId", null);

        reportsRecyclerView = findViewById(R.id.reports_recycler_view);

        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());
        reportsRecyclerView.setLayoutManager(layoutManager);

        RecyclerView.Adapter chatRecyclerAdapter = new ReportsRecyclerAdapter(getApplicationContext(), reports, adminId);

        reportsRecyclerView.setAdapter(chatRecyclerAdapter);
    }
}