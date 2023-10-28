package com.example.langsync.ui.chat;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.langsync.R;
import com.example.langsync.databinding.FragmentAllChatsBinding;

import org.json.JSONObject;

import java.util.List;

public class AllChatsFragment extends Fragment {

    private FragmentAllChatsBinding binding;

    private List<JSONObject> chats;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        ChatViewModel dashboardViewModel =
                new ViewModelProvider(this).get(ChatViewModel.class);

        binding = FragmentAllChatsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        RecyclerView recyclerView = root.findViewById(R.id.chat_recycler_view);

        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getContext());
        recyclerView.setLayoutManager(layoutManager);

        RecyclerView.Adapter chatRecyclerAdapter = new AllChatsRecyclerAdapter(getContext(), chats);

        recyclerView.setAdapter(chatRecyclerAdapter);

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}