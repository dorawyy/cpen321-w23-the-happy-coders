package com.example.langsync.ui.profile;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.langsync.FormActivity;
import com.example.langsync.R;
import com.example.langsync.databinding.FragmentProfileBinding;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class ProfileFragment extends Fragment {

    private FragmentProfileBinding binding;
    private Button editButton;
    private String userId;
    private TextView profileAge; 
    private TextView profileInterestedLanguages; 
    private TextView profileProficientLanguages; 
    private TextView profileLearningPreference;

    private static final String TAG = "ProfileFragment";

    // ChatGPT Usage: No
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        ProfileViewModel notificationsViewModel =
                new ViewModelProvider(this).get(ProfileViewModel.class);

        binding = FragmentProfileBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        profileAge = root.findViewById(R.id.profile_age);
        profileInterestedLanguages = root.findViewById(R.id.profile_interested_languages);
        profileProficientLanguages = root.findViewById(R.id.profile_proficient_languages);
        profileLearningPreference = root.findViewById(R.id.profile_learning_preference);
        editButton = root.findViewById(R.id.profile_edit_button);

        editButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(requireActivity(), FormActivity.class);
                startActivity(intent);
            }
        });

        SharedPreferences sharedPreferences = requireActivity().getSharedPreferences(getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        userId = sharedPreferences.getString("loggedUserId", null); // null is the default value if the key is not found

        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(getString(R.string.base_url) + "users/" + userId)
                .build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Failed to get user info");
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if(response.isSuccessful()) {
                    try {
                        Log.d(TAG, "Im over here");
                        JSONObject json = new JSONObject(response.body().string());
                        JSONObject user = json.getJSONObject("user");
                        JSONArray proficientLanguages = user.getJSONArray("proficientLanguages");
                        JSONArray interestedLanguages = user.getJSONArray("interestedLanguages");
                        String age = user.getString("age");
                        String learningPreference = user.getString("learningPreference");
                        Log.d(TAG, "User info: " + user);

                        getActivity().runOnUiThread( new Runnable() {
                            @Override
                            public void run() {
                                profileAge.setText(age);
                                profileProficientLanguages.setText(proficientLanguages.toString());
                                profileInterestedLanguages.setText(interestedLanguages.toString());
                                profileLearningPreference.setText(learningPreference);
                            }
                        });

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    Log.d(TAG, "Failed to get user information");
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