package com.example.langsync.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.langsync.R;
import com.example.langsync.databinding.FragmentHomeBinding;

public class HomeFragment extends Fragment {

    private FragmentHomeBinding binding;
    private CardView matchCard;
    private ImageView dislikeMatch, likeMatch;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        HomeViewModel homeViewModel =
                new ViewModelProvider(this).get(HomeViewModel.class);

        binding = FragmentHomeBinding.inflate(inflater, container, false);

        View root = binding.getRoot();

        matchCard = root.findViewById(R.id.match_card);

        dislikeMatch = root.findViewById(R.id.dislike_match);
        likeMatch = root.findViewById(R.id.like_match);

        dislikeMatch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                matchCard.animate().rotationX(45).translationX(4.0f).alpha(0.0f).setDuration(1000);
//                matchCard.setVisibility(View.GONE);
            }
        });

        likeMatch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                matchCard.animate().translationXBy(240.0f).alpha(0.0f).setDuration(500).withEndAction(new Runnable() {
                    @Override
                    public void run() {
                        
                    }
                }
            );}
        });

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}