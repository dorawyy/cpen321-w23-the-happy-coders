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

import java.util.List;

public class AllChatsRecyclerAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private static final int TYPE = 1;
    private final Context context;
    private final List<JSONObject> chats;

    public AllChatsRecyclerAdapter(Context context, List<JSONObject> chats) {
        this.context = context;
        this.chats = chats;
        Log.d("ChatFragment", "Constructor Adapter");
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
            vh.chat_name.setText(chat.getString("name"));
            vh.chat_last_message.setText(chat.getString("recentMsg"));
            vh.chat_profile_pic.setImageBitmap((Bitmap) chat.get("profilePic"));
        } catch (JSONException ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public int getItemCount() {
        if(chats.size() == 0)
            return 1;
        else
            return chats.size();
    }
}
