package com.example.langsync.ui.notifications;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.langsync.MainActivity;
import com.example.langsync.R;
import com.example.langsync.VideoCallActivity;
import com.example.langsync.databinding.FragmentNotificationsBinding;

public class NotificationsFragment extends Fragment {

    private FragmentNotificationsBinding binding;
    private Button videoButton;


    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        NotificationsViewModel notificationsViewModel =
                new ViewModelProvider(this).get(NotificationsViewModel.class);

        binding = FragmentNotificationsBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        videoButton = root.findViewById(R.id.video_button);
        videoButton.setOnClickListener(view -> {
            Intent intent = new Intent(getActivity(), VideoCallActivity.class);
            intent.putExtra("REMOTE_USER", "test");
            intent.putExtra("LOCAL_USER", "channel");
            startActivity(intent);
        });

        return root;
    }



    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}