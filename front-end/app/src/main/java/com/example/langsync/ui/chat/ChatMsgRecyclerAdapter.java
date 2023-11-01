package com.example.langsync.ui.chat;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Color;
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

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class ChatMsgRecyclerAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private static final int TYPE = 1;
    private final Context context;
    private final List<JSONObject> messages;

    private String userId;

    SharedPreferences sharedPreferences;

    public ChatMsgRecyclerAdapter(Context context, List<JSONObject> messages, String userId) {
        this.context = context;
        this.messages = messages;
        this.userId = userId;
    }

    public class MessageViewHolder extends RecyclerView.ViewHolder {
        private TextView sentMsg, receivedMsg;
        private LinearLayout sentMsgView, receivedMsgView;
        public MessageViewHolder(View itemView) {
            super(itemView);
            sentMsg = itemView.findViewById(R.id.sent_msg_txt);
            sentMsgView = itemView.findViewById(R.id.sent_msg);
            receivedMsg = itemView.findViewById(R.id.received_msg_txt);
            receivedMsgView = itemView.findViewById(R.id.received_msg);
        }
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.chat_message_item, parent, false);
        return new MessageViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int i) {

        MessageViewHolder vh = (MessageViewHolder) viewHolder;
        JSONObject msgObj = messages.get(i);
        Log.d("ChatMsgRecyclerAdapter", "Bind Number: " + i);
        try {
            if(Objects.equals(msgObj.getString("sourceUserId"), "6541a9947cce981c74b03ecb")){
                vh.receivedMsgView.setAlpha(0.9f);
            }
            if(Objects.equals(msgObj.getString("sourceUserId"), userId)) {
                Log.d("ChatMsgRecyclerAdapter", "Sent Message: " + msgObj.getString("content"));
                vh.sentMsg.setText(msgObj.getString("content"));
                vh.receivedMsgView.setAlpha(0.0f);
            }
            else {
                Log.d("ChatMsgRecyclerAdapter", "Received Message: " + msgObj.getString("content"));
                vh.receivedMsg.setText(msgObj.getString("content"));
                vh.sentMsgView.setAlpha(0.0f);
            }
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int getItemCount() {
        if(messages.size() == 0)
            return 1;
        else
            return messages.size();
    }
}

