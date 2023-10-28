package com.example.langsync.ui.chat;
import android.content.Context;
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
    private final List<Map.Entry<String, String>> messages;

    public ChatMsgRecyclerAdapter(Context context, List<Map.Entry<String, String>> messages) {
        this.context = context;
        this.messages = messages;
    }

    public class MessageViewHolder extends RecyclerView.ViewHolder {
        private TextView sentMsg;
        private TextView receivedMsg;
        public MessageViewHolder(View itemView) {
            super(itemView);
            sentMsg = itemView.findViewById(R.id.sent_msg);
            receivedMsg = itemView.findViewById(R.id.received_msg);
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
        Map.Entry<String, String> msg = messages.get(i);

        if(Objects.equals(msg.getKey(), "sent")) {
            vh.sentMsg.setText(msg.getValue());
            vh.receivedMsg.setVisibility(View.GONE);
        }
        else {
            vh.receivedMsg.setText(msg.getValue());
            vh.sentMsg.setVisibility(View.GONE);
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

