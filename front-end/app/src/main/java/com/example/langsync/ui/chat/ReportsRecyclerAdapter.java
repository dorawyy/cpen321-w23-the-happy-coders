package com.example.langsync.ui.chat;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.media.Image;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.AppCompatButton;
import androidx.recyclerview.widget.RecyclerView;

import com.example.langsync.R;
import com.example.langsync.util.AuthenticationUtilities;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ReportsRecyclerAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private static final int TYPE = 1;
    private final Context context;
    private final List<JSONObject> reports;

    private String adminId;

    SharedPreferences sharedPreferences;

    // ChatGPT Usage: No
    public ReportsRecyclerAdapter(Context context, List<JSONObject> reports, String adminId) {
        this.context = context;
        this.reports = reports;
        this.adminId = adminId;
    }

    // ChatGPT Usage: No
    public class MessageViewHolder extends RecyclerView.ViewHolder {
        private TextView reportedUser, reason;
        private ImageView removeReport, banUser;
        public MessageViewHolder(View itemView) {
            super(itemView);
            reportedUser = itemView.findViewById(R.id.reported_user);
            reason = itemView.findViewById(R.id.reported_reason);
            removeReport = itemView.findViewById(R.id.remove_report);
            banUser = itemView.findViewById(R.id.ban_user);
        }
    }

    // ChatGPT Usage: No
    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.report_item, parent, false);
        return new MessageViewHolder(view);
    }

    // ChatGPT Usage: No
    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int i) {

        MessageViewHolder vh = (MessageViewHolder) viewHolder;
        JSONObject report = reports.get(i);
        AuthenticationUtilities authenticationUtilities = new AuthenticationUtilities(context);
        try {
            vh.reportedUser.setText(report.getString("reportedUserId"));
            vh.reason.setText(report.getString("reportMessage"));
            vh.banUser.setOnClickListener(v -> {
                OkHttpClient client = new OkHttpClient();

                try {
                    JSONObject json = new JSONObject();
                    json.put("userId", report.getString("reportedUserId"));
                    RequestBody body = RequestBody.create(json.toString(), null);
                    Request request = new Request.Builder()
                            .url("http://4.204.191.217:8081/" + adminId + "/ban")
                            .put(body)
                            .build();
                    client.newCall(request).enqueue(new Callback() {
                        @Override
                        public void onFailure(@NonNull Call call, @NonNull IOException e) {
                            Log.d("ReportsRecyclerAdapter", "Error banning user");
                            Log.d("ReportsRecyclerAdapter", Objects.requireNonNull(e.getMessage()));
                            authenticationUtilities.showToast("Error banning user");
                            e.printStackTrace();
                        }

                        @Override
                        public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                            if(response.isSuccessful()){
                                Log.d("ReportsRecyclerAdapter", "Successfully banned user");
                                authenticationUtilities.showToast("Successfully banned user");
                            } else{
                                Log.d("ReportsRecyclerAdapter", "Error banning user");
                                authenticationUtilities.showToast("Error banning user");
                            }
                        }
                    });
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }

            });
            vh.removeReport.setOnClickListener(v -> {
                OkHttpClient client = new OkHttpClient();
                JSONObject json = new JSONObject();
                try {
                    json.put("reportId", report.getString("_id"));
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                RequestBody body = RequestBody.create(json.toString(), null);
                Request request = new Request.Builder()
                        .url("http://4.204.191.217:8081/" + adminId)
                        .delete(body)
                        .build();
                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(@NonNull Call call, @NonNull IOException e) {
                        Log.d("ReportsRecyclerAdapter", "Error removing report");
                        Log.d("ReportsRecyclerAdapter", Objects.requireNonNull(e.getMessage()));
                        authenticationUtilities.showToast("Error removing report");
                        e.printStackTrace();
                    }

                    @Override
                    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                        if(response.isSuccessful()){
                            Log.d("ReportsRecyclerAdapter", "Successfully removed report");
                            authenticationUtilities.showToast("Successfully removed report");
                        } else{
                            Log.d("ReportsRecyclerAdapter", "Error removing report");
                            authenticationUtilities.showToast("Error removing report");
                        }
                    }
                });
            });
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    // ChatGPT Usage: No
    @Override
    public int getItemCount() {
        if(reports.size() == 0)
            return 1;
        else
            return reports.size();
    }
}

