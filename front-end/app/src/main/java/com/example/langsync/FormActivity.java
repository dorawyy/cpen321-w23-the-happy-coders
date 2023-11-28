package com.example.langsync;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.InputType;
import android.util.Log;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.example.langsync.util.AuthenticationUtilities;
import com.example.langsync.util.JSONObjectUtilities;
import com.google.android.material.button.MaterialButton;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;


public class FormActivity extends AppCompatActivity {

    private TextView learningPreferencesTextView;
    private TextView desiredLanguagesTextView;
    private TextView proficientLanguagesTextView;
    private TextView interestsTextView;
    private TextView age;
    boolean desiredLanguagesSelected[] = new boolean[DESIRED_LANGUAGES.length];
    boolean proficientLanguagesSelected[] = new boolean[PROFICIENT_LANGUAGES.length];
    boolean interestsSelected[] = new boolean[INTERESTS.length];
    private static final String TAG = "FormActivity";
    private static final String[] PROFICIENT_LANGUAGES = new String[]{
            "English",
            "French",
            "Arabic",
            "Portuguese",
            "Punjabi"
    };
    private static final String[] DESIRED_LANGUAGES = new String[]{
            "English",
            "French",
            "Arabic",
            "Portuguese",
            "Punjabi"
    };
    private static final String[] LEARNING_PREFERENCES = new String[]{
            "Taught by Expert",
            "Peer Learning",
            "Both"
    };

    private static final String[] INTERESTS = new String[]{
            "Business",
            "Sports",
            "Cooking",
            "Travel",
            "Movies",
            "Art",
            "Music",
            "Reading",
            "Gaming",
    };

    private List<String> selectedDesires = new ArrayList<>();
    private List<String> selectedProficiencies = new ArrayList<>();
    private List<String> selectedInterests = new ArrayList<>();
    private String selectedPreference = "";
    private String selectedAge = "";

    private String userId;
    private final AuthenticationUtilities utilities = new AuthenticationUtilities(FormActivity.this);

    // ChatGPT Usage: No
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_form);

        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        userId = sharedPreferences.getString("loggedUserId", null); // null is the default value if the key is not found
        Log.d(TAG, "Shared Pref User Id: " + userId);

        desiredLanguagesTextView = findViewById(R.id.desired_languages);
        proficientLanguagesTextView = findViewById(R.id.proficient_languages);
        learningPreferencesTextView = findViewById(R.id.learning_preferences);
        interestsTextView = findViewById(R.id.interests);
        age = findViewById(R.id.age);
        MaterialButton submitButton = findViewById(R.id.submit_button);


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
                onResponseGettingUser(response);
            }
        });

        multiSelectOnClick(desiredLanguagesTextView, DESIRED_LANGUAGES, desiredLanguagesSelected, getString(R.string.desired_lang_text));
        multiSelectOnClick(proficientLanguagesTextView, PROFICIENT_LANGUAGES, proficientLanguagesSelected, getString(R.string.proficient_lang_text));
        multiSelectOnClick(interestsTextView, INTERESTS, interestsSelected, getString(R.string.select_interests_text));

        learningPreferencesTextView.setOnClickListener(v -> {
            openLearningPreferences();
        });

        age.setOnClickListener(v -> {
            openAge();
        });

        submitButton.setOnClickListener(v -> {
            onFormSubmit();
        });
    }

    // ChatGPT usage: no
    private void onResponseGettingUser(Response response) throws IOException{
        if(response.isSuccessful()) {
            try {
                JSONObject json = new JSONObject(response.body().string());
                JSONObject user = json.getJSONObject("user");
                JSONObject interests = user.getJSONObject("interests");
                JSONArray proficientLanguages = user.getJSONArray("proficientLanguages");
                JSONArray desiredLanguages = user.getJSONArray("interestedLanguages");
                String ageStr = user.getString("age");
                String learningPreference = user.getString("learningPreference");

                selectedAge = ageStr;
                selectedPreference = learningPreference;
                selectedProficiencies = JSONObjectUtilities.jsonArrayToList(proficientLanguages);
                selectedDesires = JSONObjectUtilities.jsonArrayToList(desiredLanguages);
                selectedInterests = JSONObjectUtilities.interestObjToList(interests);
                
                runOnUiThread(() -> {
                    if(isAgeValid(ageStr)){
                        age.setText(selectedAge);
                    }
                    updateMultiSelectTextView(desiredLanguagesTextView, selectedDesires);
                    updateMultiSelectTextView(proficientLanguagesTextView, selectedProficiencies);
                    updateMultiSelectTextView(interestsTextView, selectedInterests);
                    learningPreferencesTextView.setText(selectedPreference);
                });
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            Log.d(TAG, "Failed to get user information");
        }
    }

    // ChatGPT Usage: no
    private boolean isSubmissionInvalid(){
       return selectedDesires.size() == 0 ||
               selectedProficiencies.size() == 0 ||
               selectedInterests.size() == 0 ||
               selectedPreference.equals("") ||
               selectedAge.equals("") ||
               !isAgeValid(selectedAge);
    }

    // ChatGPT Usage: no
    private void onFormSubmit(){
        if (isSubmissionInvalid()) {
            Toast.makeText(FormActivity.this, "Please fill all the fields", Toast.LENGTH_SHORT).show();
        } else {
            JSONObject jsonObject;
            try {
                jsonObject = formatFormResponses();
                OkHttpClient client = new OkHttpClient();

                MediaType JSON = MediaType.parse("application/json; charset=utf-8");
                RequestBody body = RequestBody.create(jsonObject.toString(), JSON);
                Request request = new Request.Builder()
                        .url(getString(R.string.base_url) + "users/" + userId + "/prefs")
                        .put(body)
                        .build();

                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(@NonNull Call call, @NonNull IOException e) {
                        e.printStackTrace();
                    }
                    @Override
                    public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                        if (response.isSuccessful()) {
                            String serverResponse = Objects.requireNonNull(response.body()).string();
                            try {
                                JSONObject jsonObject = new JSONObject(serverResponse);
                                boolean success = jsonObject.getBoolean("success");
                                if (success) {
                                    utilities.navigateTo(MainActivity.class,"Form Submitted" );
                                } else {
                                    utilities.showToast("Error submitting form");
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                                Log.d(TAG, "Error getting prefernce response");
                            }
                        } else {
                            Log.d(TAG, "onResponse: " + response.body().string());
                        }
                    }
                });
            } catch (JSONException e) {
                e.printStackTrace();
                Log.d(TAG, "Error creating json object: " + e.getMessage());
            }
        }
    }

    // ChatGPT Usage: no
    private void openLearningPreferences(){
        AlertDialog.Builder builder = new AlertDialog.Builder(FormActivity.this);
        builder.setTitle("Select Learning Preferences");
        builder.setCancelable(false);

        int selectedPreferenceIndex = -1; // Default index for no selection

        // Iterate through LEARNING_PREFERENCES to find a match for selectedPreference
        for (int i = 0; i < LEARNING_PREFERENCES.length; i++) {
            if (selectedPreference != null && selectedPreference.equals(LEARNING_PREFERENCES[i])) {
                selectedPreferenceIndex = i;
                break;
            }
        }

        builder.setSingleChoiceItems(LEARNING_PREFERENCES, selectedPreferenceIndex, (dialog, i) -> {
            selectedPreference = LEARNING_PREFERENCES[i];
        });

        builder.setPositiveButton("OK", (dialog, which) -> {
            learningPreferencesTextView.setText(selectedPreference);
        });
        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss());
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    // ChatGPT Usage: no
    private void openAge(){
        AlertDialog.Builder builder = new AlertDialog.Builder(FormActivity.this);
        builder.setTitle("Select Age");
        builder.setCancelable(false);

        final EditText input = new EditText(this);
        input.setLayoutParams(new FrameLayout.LayoutParams(40, FrameLayout.LayoutParams.MATCH_PARENT));
        input.setInputType(InputType.TYPE_CLASS_NUMBER);
        builder.setView(input);

        builder.setPositiveButton("OK", (dialog, which) -> {
            String enteredText = input.getText().toString();
            if (!enteredText.isEmpty()) {
                if (isAgeValid(enteredText)) {
                    selectedAge = enteredText;
                } else {
                    selectedAge = "";
                    Toast.makeText(getApplicationContext(), "Please enter a valid age between 8 and 120", Toast.LENGTH_SHORT).show();
                }
                age.setText(selectedAge);
            } else {
                // Handle case where input is empty
                Toast.makeText(getApplicationContext(), "Please enter an age", Toast.LENGTH_SHORT).show();
            }
        });

        builder.setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss());
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private boolean isAgeValid(String age){
        try{
            int ageValue = Integer.valueOf(age);
            return ageValue >= 8 && ageValue <= 120;
        } catch (Exception e){
            return false;
        }
    }

    // ChatGPT Usage: No
    private JSONObject formatFormResponses() throws JSONException {

        JSONObject jsonObject = new JSONObject();

        JSONObject interests = new JSONObject();
        for(String interest : INTERESTS) {
            try {
                interests.put(interest.toLowerCase(), selectedInterests.contains(interest));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        String preference = selectedPreference.equals("Taught by Expert") ? "Expert" : selectedPreference.equals("Peer Learning") ? "Partner" : "Both";


        try {
            JSONArray interestedLanguages = new JSONArray(selectedDesires.toArray());
            JSONArray proficientLanguages = new JSONArray(selectedProficiencies.toArray());

            jsonObject.put("interestedLanguages", interestedLanguages);
            jsonObject.put("proficientLanguages", proficientLanguages);
            jsonObject.put("learningPreference", preference);
            jsonObject.put("interests", interests);
            jsonObject.put("age", Integer.valueOf(selectedAge));
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return jsonObject;
    }

    // ChatGPT Usage: No
    private void updateMultiSelectTextView(TextView textView, List<String> selectedOptions){
        StringBuilder selectedOptionsString = new StringBuilder();
        for (String s : selectedOptions) {
            selectedOptionsString.append(s).append(", ");
        }
        textView.setText(selectedOptionsString.toString());
    }

    // ChatGPT Usage: No
    private void multiSelectOnClick(TextView textView, String[] options, boolean[] selected, String title) {
        textView.setOnClickListener(v -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(FormActivity.this);
            List<String> selectedOptions = getMultiSelectSelectedOptions(title);
            builder.setTitle(title);
            builder.setCancelable(false);

            for (int i = 0; i < options.length; i++) {
                selected[i] = selectedOptions.contains(options[i]);
            }

            builder.setMultiChoiceItems(options, selected, (dialog, i, isChecked) -> {
                if (isChecked) {
                    selectedOptions.add(options[i]);
                } else {
                    selectedOptions.remove(options[i]);
                }
            });
            builder.setPositiveButton("OK", (dialog, which) -> {
                updateMultiSelectTextView(textView, selectedOptions);
            });
            builder.setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss());
            AlertDialog dialog = builder.create();
            dialog.show();
        });
    }

    // ChatGPT Usage: No
    private List<String> getMultiSelectSelectedOptions(String title){
        List<String> retArray;
        if(title == getString(R.string.desired_lang_text)){
            retArray = selectedDesires;
        } else if (title == getString(R.string.proficient_lang_text)) {
            retArray = selectedProficiencies;
        }else{
            retArray = selectedInterests;
        }

        return retArray;
    }
}