package com.example.langsync;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.langsync.util.AuthenticationUtilities;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ReportsRecyclerAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private static final int TYPE = 1;
    private final Context context;
    private final List<JSONObject> reports;

    private String adminId;

    private Activity parentActivity;

    SharedPreferences sharedPreferences;

    public ReportsRecyclerAdapter(Activity activity, Context context, List<JSONObject> reports, String adminId) {
        this.context = context;
        this.reports = reports;
        this.adminId = adminId;
        parentActivity = activity;
    }

    public class ReportsViewHolder extends RecyclerView.ViewHolder {
        private TextView reportedUser; 
        private TextView reason;
        private ImageView removeReport;
        private ImageView banUser;
        public ReportsViewHolder(View itemView) {
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
        return new ReportsViewHolder(view);
    }

    // ChatGPT Usage: No
    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int i) {

        ReportsViewHolder vh = (ReportsViewHolder) viewHolder;
        try {
            if(reports.get(i).getBoolean("isFirst")){
                vh.itemView.setVisibility(View.GONE);
                return;
            }
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        JSONObject report = reports.get(i);
        try {
            vh.reportedUser.setText(report.getString("reportedUserId"));
            vh.reason.setText(report.getString("reportMessage"));
            vh.banUser.setOnClickListener(v -> {
                OkHttpClient client = new OkHttpClient();
                try {
                    JSONObject json = new JSONObject();
                    json.put("userId", report.getString("reportedUserId"));
                    json.put("reportId", report.getString("_id"));
                    Log.d("ReportsRecyclerAdapter", json.toString());
                    MediaType JSON = MediaType.parse("application/json; charset=utf-8");
                    RequestBody body = RequestBody.create(json.toString(), JSON);
                    Request request = new Request.Builder()
                            .url(context.getString(R.string.base_url) + "moderation/" + adminId + "/ban")
                            .put(body)
                            .build();
                    client.newCall(request).enqueue(new Callback() {
                        @Override
                        public void onFailure(@NonNull Call call, @NonNull IOException e) {
                            Log.d("ReportsRecyclerAdapter", "Error banning user");
                            Log.d("ReportsRecyclerAdapter", Objects.requireNonNull(e.getMessage()));
                            e.printStackTrace();
                        }

                        @Override
                        public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                            if(response.isSuccessful()){
                                Log.d("ReportsRecyclerAdapter", "Successfully banned user");
                                Log.d("ReportsRecyclerAdapter", Objects.requireNonNull(response.body()).string());
                                reports.remove(i);
                                parentActivity.runOnUiThread(() -> {
                                    notifyDataSetChanged();
                                });
                            } else{
                                Log.d("ReportsRecyclerAdapter", "Error banning user");
                            }
                        }
                    });
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }

            });
            vh.removeReport.setOnClickListener(v -> {
                OkHttpClient client = new OkHttpClient();
                String reportId;
                try {
                    reportId = report.getString("_id");
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                Request request = new Request.Builder()
                        .url(context.getString(R.string.base_url) + "moderation/" + adminId + "/" + reportId)
                        .delete()
                        .build();
                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(@NonNull Call call, @NonNull IOException e) {
                        Log.d("ReportsRecyclerAdapter", "Error removing report");
                        Log.d("ReportsRecyclerAdapter", Objects.requireNonNull(e.getMessage()));
                        e.printStackTrace();
                    }

                    @Override
                    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                        if(response.isSuccessful()){
                            Log.d("ReportsRecyclerAdapter", "Successfully removed report");
                            Log.d("ReportsRecyclerAdapter", Objects.requireNonNull(response.body()).string());
                            reports.remove(i);

                            parentActivity.runOnUiThread(() -> {
                                notifyDataSetChanged();
                            });

                        } else{
                            Log.d("ReportsRecyclerAdapter", "Error removing report");
                            Log.d("ReportsRecyclerAdapter", Objects.requireNonNull(response.body()).string());
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

