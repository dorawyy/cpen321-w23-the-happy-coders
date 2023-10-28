package com.example.langsync;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import java.util.ArrayList;
import java.util.List;

public class FormActivity extends AppCompatActivity {

    Spinner desiredLanguages, proficientLanguages, learningPreferences;
    private static final String TAG = "FormActivity";
    private static final String[] PROFICIENT_LANGUAGES = new String[]{
            "English",
            "Spanish",
            "French",
            "Arabic",
            "Hindi",
            "Portuguese",
            "Punjabi"
    };
    private static final String[] DESIRED_LANGUAGES = new String[]{
            "English",
            "Spanish",
            "French",
            "Arabic",
            "Hindi",
            "Portuguese",
            "Punjabi"
    };
    private static final String[] LEARNING_PREFERENCES = new String[]{
            "Taught by Expert",
            "Peer Learning",
            "Both"
    };
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_form);

        desiredLanguages = findViewById(R.id.desired_languages);
        proficientLanguages = findViewById(R.id.proficient_languages);

        ArrayAdapter<String> proficientLangAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, PROFICIENT_LANGUAGES);
        ArrayAdapter<String> desiredLangAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, PROFICIENT_LANGUAGES);
        ArrayAdapter<String> learningPreferencesAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, LEARNING_PREFERENCES);

        desiredLanguages.setAdapter(desiredLangAdapter);
        proficientLanguages.setAdapter(proficientLangAdapter);
        learningPreferences.setAdapter(learningPreferencesAdapter);
    }
}