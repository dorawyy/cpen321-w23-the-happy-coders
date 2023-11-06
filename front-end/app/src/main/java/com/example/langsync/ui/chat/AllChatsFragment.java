package com.example.langsync.ui.chat;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.langsync.R;
import com.example.langsync.databinding.FragmentAllChatsBinding;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Objects;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class AllChatsFragment extends Fragment {

    private static final String TAG = "AllChatsFragment";
    private FragmentAllChatsBinding binding;
    private HashMap<String, JSONObject> chats = new HashMap<>();
    private RecyclerView recyclerView;

    public static String currentChatroom;
    private String userId;
    private CardView noChats;

    // ChatGPT Usage: No
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        SharedPreferences sharedPreferences = requireActivity().getSharedPreferences(getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        userId = sharedPreferences.getString("loggedUserId", null);


        binding = FragmentAllChatsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();
        noChats = root.findViewById(R.id.no_chats);

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(getString(R.string.base_url) + "chatrooms/" + userId)
                .get()
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Error getting chatrooms");
                Log.d(TAG, Objects.requireNonNull(e.getMessage()));
                e.printStackTrace();
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if(response.isSuccessful()){
                    try {
                        JSONObject responseBody = new JSONObject(response.body().string());
                        JSONArray chatroomsList = new JSONArray(responseBody.getString("chatroomList"));

                        for(int i = 0; i < chatroomsList.length(); i++) {
                            chats.put(chatroomsList.getJSONObject(i).getString("_id"), chatroomsList.getJSONObject(i));
                        }
                        requireActivity().runOnUiThread(() -> {
                            if(!chats.isEmpty()) {

                                noChats.setVisibility(View.GONE);
                                recyclerView = root.findViewById(R.id.chat_recycler_view);

                                RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getContext());
                                recyclerView.setLayoutManager(layoutManager);

                                RecyclerView.Adapter chatRecyclerAdapter = new AllChatsRecyclerAdapter(getContext(), chats, userId);

                                recyclerView.setAdapter(chatRecyclerAdapter);
                            } else {
                                noChats.setVisibility(View.VISIBLE);
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                        Log.d(TAG, "Error parsing response");
                    }

                }
            }
        });

        return root;
    }

    // ChatGPT Usage: No
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}