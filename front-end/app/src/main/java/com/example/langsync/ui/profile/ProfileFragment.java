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
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.example.langsync.CalendarActivity;
import com.example.langsync.FormActivity;
import com.example.langsync.LoginActivity;
import com.example.langsync.R;
import com.example.langsync.databinding.FragmentProfileBinding;
import com.example.langsync.util.JSONObjectUtilities;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.squareup.picasso.Picasso;

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
    private TextView profileAge;
    private TextView profileInterestedLanguages; 
    private TextView profileProficientLanguages; 
    private TextView profileLearningPreference;
    private TextView profileName;
    private TextView profileInterests;
    private ImageView profileImage;
    private GoogleSignInClient mGoogleSignInClient;
    private static final String TAG = "ProfileFragment";


    // ChatGPT Usage: No
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentProfileBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        profileAge = root.findViewById(R.id.profile_age);
        profileInterestedLanguages = root.findViewById(R.id.profile_interested_languages);
        profileProficientLanguages = root.findViewById(R.id.profile_proficient_languages);
        profileLearningPreference = root.findViewById(R.id.profile_learning_preference);
        profileImage = root.findViewById(R.id.profile_image);
        profileName = root.findViewById(R.id.profile_name);
        profileInterests = root.findViewById(R.id.profile_interests);
        Button editButton = root.findViewById(R.id.profile_edit_button);
        Button logoutButton = root.findViewById(R.id.logout_button);
        ImageView eventsButton = root.findViewById(R.id.profile_events_button);

        eventsButton.setOnClickListener(v -> {
            Intent intent = new Intent(requireActivity(), CalendarActivity.class);
            startActivity(intent);
        });

        editButton.setOnClickListener(view -> {
            Intent intent = new Intent(requireActivity(), FormActivity.class);
            startActivity(intent);
        });

        logoutButton.setOnClickListener(view -> {
            signOut();
        });

        SharedPreferences sharedPreferences = requireActivity().getSharedPreferences(getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        String userId = sharedPreferences.getString("loggedUserId", null);

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
                        JSONObject json = new JSONObject(response.body().string());
                        JSONObject user = json.getJSONObject("user");
                        JSONArray proficientLanguages = user.getJSONArray("proficientLanguages");
                        JSONArray interestedLanguages = user.getJSONArray("interestedLanguages");
                        String age = user.getString("age");
                        String learningPreference = user.getString("learningPreference");
                        String displayName = user.getString("displayName");
                        String interests = JSONObjectUtilities.getInterestsString(user.getJSONObject("interests"));
                        String pictureUrl = null;
                        try {
                            pictureUrl = user.getString("picture");
                        }catch (Exception e){
                            Log.d(TAG, "User has no profile picture");
                        }
                        Log.d(TAG, "User info: " + user);
                        String finalPictureUrl = pictureUrl;

                        requireActivity().runOnUiThread(() -> {
                            profileAge.setText(age);
                            profileProficientLanguages.setText(JSONObjectUtilities.jsonArrayToString(proficientLanguages));
                            profileInterestedLanguages.setText(JSONObjectUtilities.jsonArrayToString(interestedLanguages));
                            profileLearningPreference.setText(learningPreference);
                            profileName.setText(displayName);
                            profileInterests.setText(interests);
                            if(finalPictureUrl != null && !finalPictureUrl.isEmpty()){
                                Picasso.get().load(finalPictureUrl).into(profileImage);
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

    // ChatGPT usage: No


    // ChatGPT usage: No
    private void signOut() {
        mGoogleSignInClient  = GoogleSignIn.getClient(requireContext(), GoogleSignInOptions.DEFAULT_SIGN_IN);

        mGoogleSignInClient.signOut().addOnCompleteListener(requireActivity(),
                task -> {
                    Toast.makeText(requireActivity(), getString(R.string.logout_success), Toast.LENGTH_LONG).show();
                    Intent intent = new Intent(requireActivity(), LoginActivity.class);
                    startActivity(intent);
        });
    }
}