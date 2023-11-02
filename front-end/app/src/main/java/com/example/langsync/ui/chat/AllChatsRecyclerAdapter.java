package com.example.langsync.ui.chat;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.AppCompatButton;
import androidx.recyclerview.widget.RecyclerView;

import com.example.langsync.ChatActivity;
import com.example.langsync.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class AllChatsRecyclerAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private static final int TYPE = 1;
    private final Context context;
    private final HashMap<String, JSONObject> chatrooms;
    private final List<JSONObject> chats;
    private String userID;

    public ArrayList<JSONObject> messages = new ArrayList<>();

    public AllChatsRecyclerAdapter(Context context, HashMap<String, JSONObject> chatrooms, String userId) {
        this.context = context;
        this.chatrooms = chatrooms;
        this.chats = new ArrayList<>(chatrooms.values());
        this.userID = userId;
    }

    public class ChatViewHolder extends RecyclerView.ViewHolder {
        private TextView chat_name;
        private TextView chat_last_message;
        private ImageView chat_profile_pic;
        public ChatViewHolder(View itemView) {
            super(itemView);
            chat_name = itemView.findViewById(R.id.chat_name);
            chat_last_message = itemView.findViewById(R.id.chat_recent_msg);
            chat_profile_pic = itemView.findViewById(R.id.chat_profile_pic);
        }
    }


    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.chat_item, parent, false);
        return new ChatViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int i) {

        ChatViewHolder vh = (ChatViewHolder) viewHolder;
        JSONObject chat = chats.get(i);

        try {
            vh.chat_name.setText(chat.getString("otherUserName"));
//            vh.chat_last_message.setText(chat.getJSONObject("messages").);
//            vh.chat_profile_pic.setImageBitmap((Bitmap) chat.get("profilePic"));

            vh.itemView.setOnClickListener(v -> {
                try {
                    JSONObject chatObj = chats.get(i);
                    AllChatsFragment.currentChatroom = chatObj.getString("_id");
                    Intent intent = new Intent(context, ChatActivity.class);

                    if(Objects.equals(userID, chatObj.getString("user2Id")))
                        intent.putExtra("otherUserId", chatObj.getString("user1Id"));
                    else if(Objects.equals(userID, chatObj.getString("user1Id")))
                        intent.putExtra("otherUserId", chatObj.getString("user2Id"));

                    getMessages(chatObj.getString("_id"), intent);

                    intent.putExtra("otherUserName", chatObj.getString("otherUserName"));
                    intent.putExtra("chatroomId", chatObj.getString("_id"));

                    context.startActivity(intent);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
            });
        } catch (JSONException ex) {
            throw new RuntimeException(ex);
        }
    }

    private void getMessages(String chatroomId, Intent intent) {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("http://20.63.119.166:8081/chatroom/" + chatroomId + "/messages")
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d("AllChatsRecyclerAdapter", "Failed to get messages");
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if(response.isSuccessful()) {
                    try {
                        JSONObject json = new JSONObject(response.body().string());
                        JSONArray msgArr = json.getJSONArray("messages");
                        intent.putExtra("messages", msgArr.toString());

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }
    @Override
    public int getItemCount() {
        if(chats.size() == 0)
            return 1;
        else
            return chats.size();
    }
}
