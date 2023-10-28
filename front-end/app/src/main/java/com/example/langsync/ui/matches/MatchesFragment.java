package com.example.langsync.ui.matches;

import android.os.Bundle;
import android.util.Log;
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
import com.example.langsync.databinding.FragmentMatchesBinding;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.PriorityQueue;
import java.util.Queue;

public class MatchesFragment extends Fragment {

    private static final String TAG = "MatchesFragment";
    private FragmentMatchesBinding binding;
    private CardView matchCard;
    private ImageView dislikeMatch, likeMatch;

    private Queue<String> matches = new PriorityQueue<>();
    private TextView matchName;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        matches.add("John Doe");
        matches.add("Jane Doe");
        matches.add("John Smith");
        matches.add("Jane Smith");
        matches.add("Jabari Smith");
        matches.add("Jabari Doe");

        MatchesViewModel homeViewModel =
                new ViewModelProvider(this).get(MatchesViewModel.class);

        binding = FragmentMatchesBinding.inflate(inflater, container, false);

        View root = binding.getRoot();

        matchCard = root.findViewById(R.id.match_card);

        dislikeMatch = root.findViewById(R.id.dislike_match);
        likeMatch = root.findViewById(R.id.like_match);

        dislikeMatch.setOnClickListener(v ->  matchCardAnim(-1));

        likeMatch.setOnClickListener(v -> matchCardAnim(1));

        return root;
    }

    private void matchCardAnim(int direction) {
        matchCard.animate().translationXBy(direction * 500.0f).alpha(0.0f).setDuration(500).withEndAction(new Runnable() {
            @Override
            public void run() {
                matchName = matchCard.findViewById(R.id.match_name);
                matchCard.animate().translationX(0.0f).alpha(1.0f).setDuration(300);
                matchName.setText(matches.poll());
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}