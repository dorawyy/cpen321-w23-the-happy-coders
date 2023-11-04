package com.example.langsync;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.example.langsync.util.AuthenticationUtilities;
import com.google.android.material.button.MaterialButton;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;


public class FormActivity extends AppCompatActivity {

    private TextView desiredLanguages, proficientLanguages, learningPreferences, interests, age;
    private MaterialButton submitButton;
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

        desiredLanguages = findViewById(R.id.desired_languages);
        proficientLanguages = findViewById(R.id.proficient_languages);
        learningPreferences = findViewById(R.id.learning_preferences);
        interests = findViewById(R.id.interests);
        age = findViewById(R.id.age);
        submitButton = findViewById(R.id.submit_button);

        multiSelectOnClick(desiredLanguages, DESIRED_LANGUAGES, desiredLanguagesSelected, selectedDesires);
        multiSelectOnClick(proficientLanguages, PROFICIENT_LANGUAGES, proficientLanguagesSelected, selectedProficiencies);
        multiSelectOnClick(interests, INTERESTS, interestsSelected, selectedInterests);

        learningPreferences.setOnClickListener(v -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(FormActivity.this);
            builder.setTitle("Select Learning Preferences");
            builder.setCancelable(false);

            builder.setSingleChoiceItems(LEARNING_PREFERENCES, -1, (dialog, i) -> {
                selectedPreference = LEARNING_PREFERENCES[i];
            });

            builder.setPositiveButton("OK", (dialog, which) -> {
                learningPreferences.setText(selectedPreference);
            });
            builder.setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss());
            AlertDialog dialog = builder.create();
            dialog.show();
        });

        age.setOnClickListener(v -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(FormActivity.this);
            builder.setTitle("Select Age");
            builder.setCancelable(false);

            final EditText input = new EditText(this);
            input.setLayoutParams(new FrameLayout.LayoutParams(40, FrameLayout.LayoutParams.MATCH_PARENT));
            builder.setView(input);

            builder.setPositiveButton("OK", (dialog, which) -> {
                selectedAge = input.getText().toString();
                age.setText(selectedAge);
            });
            builder.setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss());
            AlertDialog dialog = builder.create();
            dialog.show();
        });

        submitButton.setOnClickListener(v -> {
            if (selectedDesires.size() == 0 || selectedProficiencies.size() == 0 || selectedInterests.size() == 0 || selectedPreference.equals("") || selectedAge.equals("")) {
                Toast.makeText(FormActivity.this, "Please fill all the fields", Toast.LENGTH_SHORT).show();
            } else {
                JSONObject jsonObject;
                try {
                    jsonObject = formatFormResponses();
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }

                OkHttpClient client = new OkHttpClient();

                MediaType JSON = MediaType.parse("application/json; charset=utf-8");
                RequestBody body = RequestBody.create(jsonObject.toString(), JSON);
                Request request = new Request.Builder()
                        .url(getString(R.string.base_url) + "users/" + userId + "/prefs")
                        .put(body)
                        .build();

                client.newCall(request).enqueue(new okhttp3.Callback() {
                    @Override
                    public void onFailure(@NonNull okhttp3.Call call, @NonNull IOException e) {
                        e.printStackTrace();
                    }
                    @Override
                    public void onResponse(@NonNull okhttp3.Call call, @NonNull okhttp3.Response response) throws IOException {
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
                                throw new RuntimeException(e);
                            }
                        } else {
                            Log.d(TAG, "onResponse: " + response.body().string());
                        }
                    }
                });
            }
        });
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
    private void multiSelectOnClick(TextView textView, String[] options, boolean[] selected, List<String> selectedOptions) {
        textView.setOnClickListener(v -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(FormActivity.this);
            builder.setTitle("Select Languages");
            builder.setCancelable(false);
            builder.setMultiChoiceItems(options, selected, (dialog, i, isChecked) -> {
                if (isChecked) {
                    selectedOptions.add(options[i]);
                } else {
                    selectedOptions.remove(options[i]);
                }
            });
            builder.setPositiveButton("OK", (dialog, which) -> {
                StringBuilder selectedOptionsString = new StringBuilder();
                for (String s : selectedOptions) {
                    selectedOptionsString.append(s).append(", ");
                }
                textView.setText(selectedOptionsString.toString());
            });
            builder.setNegativeButton("Cancel", (dialog, which) -> dialog.dismiss());
            AlertDialog dialog = builder.create();
            dialog.show();
        });
    }
}