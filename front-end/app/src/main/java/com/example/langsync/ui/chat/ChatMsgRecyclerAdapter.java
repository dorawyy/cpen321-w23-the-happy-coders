package com.example.langsync.ui.chat;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.langsync.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Objects;

public class ChatMsgRecyclerAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private static final int TYPE = 1;
    private final Context context;
    private final List<JSONObject> messages;

    private String userId;

    SharedPreferences sharedPreferences;

    // ChatGPT Usage: No
    public ChatMsgRecyclerAdapter(Context context, List<JSONObject> messages, String userId) {
        this.context = context;
        this.messages = messages;
        this.userId = userId;
    }

    // ChatGPT Usage: No
    public class MessageViewHolder extends RecyclerView.ViewHolder {
        private TextView sentMsg;
        private TextView receivedMsg;
        private LinearLayout sentMsgView; 
        private LinearLayout receivedMsgView;
        public MessageViewHolder(View itemView) {
            super(itemView);
            sentMsg = itemView.findViewById(R.id.sent_msg_txt);
            sentMsgView = itemView.findViewById(R.id.sent_msg);
            receivedMsg = itemView.findViewById(R.id.received_msg_txt);
            receivedMsgView = itemView.findViewById(R.id.received_msg);
        }
    }

    // ChatGPT Usage: No
    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.chat_message_item, parent, false);
        return new MessageViewHolder(view);
    }

    // ChatGPT Usage: No
    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder viewHolder, int i) {

        MessageViewHolder vh = (MessageViewHolder) viewHolder;
        JSONObject msgObj = messages.get(i);
        Log.d("ChatMsgRecyclerAdapter", "Bind Number: " + i);
        try {
            if(Objects.equals(msgObj.getString("sourceUserId"), "6541a9947cce981c74b03ecb")){
                vh.receivedMsgView.setAlpha(0.8f);
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

    // ChatGPT Usage: No
    @Override
    public int getItemCount() {
        if(messages.size() == 0)
            return 1;
        else
            return messages.size();
    }
}

