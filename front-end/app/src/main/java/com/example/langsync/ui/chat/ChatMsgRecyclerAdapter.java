package com.example.langsync.ui.chat;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.langsync.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Objects;

public class ChatMsgRecyclerAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private final List<JSONObject> messages;

    private String userId;

    // ChatGPT Usage: No
    public ChatMsgRecyclerAdapter(List<JSONObject> messages, String userId) {
        this.messages = messages;
        this.userId = userId;
    }

    // ChatGPT Usage: No
    public class MessageViewHolder extends RecyclerView.ViewHolder {
        private TextView sentMsg;
        private TextView receivedMsg;
        private LinearLayout sentMsgView; 
        private LinearLayout receivedMsgView;

        private LinearLayout loadingMsg;

        private ImageView loadingMsgGif;
        public MessageViewHolder(View itemView) {
            super(itemView);
            sentMsg = itemView.findViewById(R.id.sent_msg_txt);
            sentMsgView = itemView.findViewById(R.id.sent_msg);
            receivedMsg = itemView.findViewById(R.id.received_msg_txt);
            receivedMsgView = itemView.findViewById(R.id.received_msg);
            loadingMsg = itemView.findViewById(R.id.loading_msg);
            loadingMsgGif = itemView.findViewById(R.id.loading_msg_img);
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
            if(!msgObj.getBoolean("loading")) {
                Log.d("ChatMsgRecyclerAdapter", "Messaging");
                vh.loadingMsg.setVisibility(View.GONE);
                vh.loadingMsgGif.setVisibility(View.GONE);
                Glide.with(vh.itemView).clear(vh.loadingMsgGif);
                if (Objects.equals(msgObj.getString("sourceUserId"), "6541a9947cce981c74b03ecb")) {
                    vh.receivedMsgView.setAlpha(0.8f);
                }
                if (Objects.equals(msgObj.getString("sourceUserId"), userId)) {
                    Log.d("ChatMsgRecyclerAdapter", "Sent Message: " + msgObj.getString("content"));
                    vh.sentMsg.setText(msgObj.getString("content"));
                    vh.receivedMsgView.setAlpha(0.0f);
                } else {
                    Log.d("ChatMsgRecyclerAdapter", "Received Message: " + msgObj.getString("content"));
                    vh.receivedMsg.setText(msgObj.getString("content"));
                    vh.sentMsgView.setAlpha(0.0f);
                }
            } else {
                Log.d("ChatMsgRecyclerAdapter", "Loading");
                vh.loadingMsg.setVisibility(View.VISIBLE);
                vh.loadingMsgGif.setVisibility(View.VISIBLE);
                vh.sentMsgView.setAlpha(0.0f);
                vh.receivedMsgView.setAlpha(0.0f);
                Glide.with(vh.itemView).load(R.drawable.loading_dots).into(vh.loadingMsgGif);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            Log.d("ChatMsgRecyclerAdapter", "Error: " + e.getMessage());
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

