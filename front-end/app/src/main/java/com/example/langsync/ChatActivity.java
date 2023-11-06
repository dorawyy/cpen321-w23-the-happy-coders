package com.example.langsync;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SwitchCompat;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.langsync.ui.chat.ChatMsgRecyclerAdapter;
import com.example.langsync.util.AuthenticationUtilities;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import io.socket.client.IO;
import io.socket.client.Socket;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ChatActivity extends AppCompatActivity {

    private static final String TAG = "ChatActivity";
    private List<JSONObject> messages = new ArrayList<>();
    private String otherUserId;
    private String userId;
    private String chatroomId;
    private CardView noMessageView;
    private EditText msgInput;
    private Socket socket;

    boolean isAiOn = false;

    private RecyclerView recyclerView;
    private RecyclerView.Adapter msgRecyclerAdapter;

    {
        try {
            socket = IO.socket("https://langsyncapp.canadacentral.cloudapp.azure.com");
        } catch (URISyntaxException e) {
            Log.d(TAG, "Error connecting to socket");
            e.printStackTrace();
        }
    }

    // ChatGPT Usage: No
    @Override
    protected void onResume() {
        super.onResume();
        socket.connect();
        socket.emit("joinChatroom", chatroomId, userId);

        socket.on("message", args -> {
            JSONObject data = (JSONObject) args[0];
            String userId = data.optString("userId");
            if (!userId.equals(this.userId)) {
                String message = data.optString("message");
                Log.d(TAG, "Message received: " + message + " from " + userId);
                JSONObject messageObj = new JSONObject();
                try {
                    messageObj.put("sourceUserId", userId);
                    messageObj.put("content", message);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                runOnUiThread(() -> {
                    messages.add(messageObj);
                    recyclerView.smoothScrollToPosition(msgRecyclerAdapter.getItemCount() - 1);
                    msgRecyclerAdapter.notifyDataSetChanged();
                });
            }
        });
    }

    // ChatGPT Usage: No
    @Override
    protected void onPause() {
        super.onPause();
        socket.disconnect();
    }

    // ChatGPT Usage: No
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), MODE_PRIVATE);
        userId = sharedPreferences.getString("loggedUserId", null);

        noMessageView = findViewById(R.id.no_messages);
        msgInput = findViewById(R.id.msg_input);
        TextView chatHeaderName = findViewById(R.id.chat_header_name);
        SwitchCompat toggleAi = findViewById(R.id.ai_switch);

        toggleAi.setOnCheckedChangeListener((buttonView, isChecked) -> {
            isAiOn = isChecked;
        });

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            String otherUserName = extras.getString("otherUserName");
            otherUserId = extras.getString("otherUserId");
            chatroomId = extras.getString("chatroomId");
            chatHeaderName.setText(otherUserName);

            getMessages(chatroomId);
        }

        ImageView goBack = findViewById(R.id.back_btn);
        ImageView videoCall = findViewById(R.id.video_call);
        ImageView sendMsg = findViewById(R.id.send_msg);
        ImageView calendarInvite = findViewById(R.id.calendar_invite);
        ImageView reportUser = findViewById(R.id.report_user);

        goBack.setOnClickListener(v -> {
            finish();
        });

        videoCall.setOnClickListener(view -> {
            Intent intent = new Intent(ChatActivity.this, VideoCallActivity.class);
            intent.putExtra(getString(R.string.channel_key), chatroomId);
            startActivity(intent);
        });

        sendMsg.setOnClickListener(v -> {
            if (!msgInput.getText().toString().isEmpty()) {
                socket.emit("sendMessage", chatroomId, userId, msgInput.getText().toString());
                InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(msgInput.getWindowToken(), 0);
                sendMessage();
            } else
                Toast.makeText(this, "Add text to send a message!", Toast.LENGTH_SHORT).show();
        });

        calendarInvite.setOnClickListener(v -> {
            Intent intent = new Intent(ChatActivity.this, CalendarActivity.class);
            intent.putExtra("otherUserId", otherUserId);
            startActivity(intent);
        });

        reportUser.setOnClickListener(v -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(ChatActivity.this);
            builder.setTitle("Report User");
            builder.setMessage("Please provide a reason for reporting this user");
            builder.setCancelable(true);
            EditText input = new EditText(ChatActivity.this);
            builder.setView(input);
            builder.setPositiveButton("Report", (dialog, which) -> {
                String reportReason = input.getText().toString();
                sendReport(reportReason);
            });
            builder.setNegativeButton("Cancel", (dialog, which) -> {
                dialog.cancel();
            });
            AlertDialog dialog = builder.create();
            dialog.show();
        });

    }

    // ChatGPT Usage: No
    private void sendReport (String reason) {
        OkHttpClient client = new OkHttpClient();
        JSONObject jsonObject = new JSONObject();
        AuthenticationUtilities auth = new AuthenticationUtilities(ChatActivity.this);
        try {
            jsonObject.put("reporterUserId", userId);
            jsonObject.put("reportedUserId", otherUserId);
            jsonObject.put("chatRoomId", chatroomId);
            jsonObject.put("reportMessage", reason);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        RequestBody body = RequestBody.create(jsonObject.toString(), JSON);
        Request request = new Request.Builder()
                .url(getString(R.string.base_url) + "moderation/")
                .post(body)
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, Objects.requireNonNull(e.getMessage()));
                Log.d(TAG, "Error sending report");
                auth.showToast("Error sending report");
                e.printStackTrace();
            }
            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if (response.isSuccessful()) {
                    try {
                        JSONObject responseBody = new JSONObject(response.body().string());
                        Log.d(TAG, "Report sent: " + responseBody);
                        auth.showToast("User Reported");
                    } catch (JSONException e) {
                        throw new RuntimeException(e);
                    }
                } else {
                    Log.d(TAG, "Error sending report: " + response.body().string());
                    auth.showToast("Error sending report");
                }
            }
        });
    }

    // ChatGPT Usage: No
    private void getMessages(String chatroomId) {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(getString(R.string.base_url) + "chatrooms/" + chatroomId + "/messages")
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d("AllChatsRecyclerAdapter", "Failed to get messages");
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if (response.isSuccessful()) {
                    try {
                        JSONObject json = new JSONObject(response.body().string());
                        JSONArray msgArr = json.getJSONArray("messages");
                        for (int i = 0; i < msgArr.length(); i++) {
                            messages.add(msgArr.getJSONObject(i));
                        }
                        Log.d(TAG, "Messages: " + messages.toString());

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    Log.d(TAG, "Failed to get messages");
                }
                if (messages.size() > 0) {
                    Log.d(TAG, "Creating recycler view");
                    createRecyclerView();
                }
            }
        });
    }

    // ChatGPT Usage: No
    private void createRecyclerView() {
        runOnUiThread(() -> {
            recyclerView = findViewById(R.id.msg_recycler_view);

            RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());
            recyclerView.setLayoutManager(layoutManager);

            msgRecyclerAdapter = new ChatMsgRecyclerAdapter(messages, userId);

            recyclerView.setAdapter(msgRecyclerAdapter);
            recyclerView.getRecycledViewPool().setMaxRecycledViews(0, 0);
            noMessageView.setVisibility(View.GONE);
            msgRecyclerAdapter.notifyDataSetChanged();
        });
    }

    // ChatGPT Usage: No
    private void sendMessage() {
        OkHttpClient client = new OkHttpClient();
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("sourceUserId", userId);
            jsonObject.put("content", msgInput.getText().toString());
            jsonObject.put("learningSession", isAiOn);
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        RequestBody body = RequestBody.create(jsonObject.toString(), JSON);
        Request request = new Request.Builder()
                .url(getString(R.string.base_url) + "chatrooms/" + chatroomId + "/messages")
                .post(body)
                .build();
        String msgText = msgInput.getText().toString();
        msgInput.setText("");
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, Objects.requireNonNull(e.getMessage()));
                e.printStackTrace();
                runOnUiThread(() -> {
                    Toast.makeText(ChatActivity.this, "Error sending message", Toast.LENGTH_SHORT).show();
                });
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) {
                if (response.isSuccessful()) {
                    try {
                        JSONObject message = new JSONObject();
                        JSONObject responseBody = new JSONObject(response.body().string());
                        JSONObject messageObj = new JSONObject(responseBody.getJSONObject("message").toString());
                        Log.d(TAG, "Message sent: " + responseBody);
                        if (messages.size() == 0) {
                            createRecyclerView();
                            runOnUiThread(() -> {
                                noMessageView.setVisibility(View.GONE);
                            });
                        }
                        message.put("sourceUserId", userId);
                        message.put("content", msgText);
                        messages.add(message);
                        if (isAiOn) {
                            Log.d(TAG, "Sending message to AI");
                            socket.emit("sendMessage", chatroomId, "6541a9947cce981c74b03ecb", messageObj.getString("content"));
                        } else {
                            Log.d(TAG, "Not sending message to AI");
                        }
                        runOnUiThread(() -> {
                            if(messages.size() > 1)
                                recyclerView.smoothScrollToPosition(msgRecyclerAdapter.getItemCount() - 1);
                            Toast.makeText(ChatActivity.this, "Message sent", Toast.LENGTH_SHORT).show();
                            msgRecyclerAdapter.notifyDataSetChanged();
                        });
                    } catch (JSONException | IOException e) {
                        throw new RuntimeException(e);
                    }
                } else {
                    Log.d(TAG, "Error sending message");
                }
            }
        });
    }
}