package com.example.langsync;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.langsync.util.AuthenticationUtilities;
import com.google.android.gms.common.api.ApiException;
import com.google.android.material.button.MaterialButton;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class AdminLoginActivity extends AppCompatActivity {

    EditText accessCodeValue;
    EditText emailValue;

    private final OkHttpClient client = new OkHttpClient();
    private static String TAG = "AdminLoginActivity";
    private final AuthenticationUtilities utilities = new AuthenticationUtilities(AdminLoginActivity.this);

    // ChatGPT Usage: No
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_login);

        accessCodeValue = findViewById(R.id.access_code_value);
        emailValue = findViewById(R.id.email_value);

        MaterialButton submitBtn = findViewById(R.id.admin_login);
        submitBtn.setOnClickListener(v -> {
            String accessCode = accessCodeValue.getText().toString();
            String email = emailValue.getText().toString();
            Log.d(TAG, "access code: " + accessCode + ", email: " + email);
            if (!accessCode.isEmpty() && !email.isEmpty()) {
                JSONObject jsonObject = new JSONObject();
                try {
                    jsonObject.put("accessCode", accessCode);
                    jsonObject.put("email", email);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                MediaType JSON = MediaType.parse("application/json; charset=utf-8");
                RequestBody body = RequestBody.create(jsonObject.toString(), JSON);
                Request request = new Request.Builder()
                        .url(getString(R.string.base_url) + "authentication/admin-login/")
                        .post(body)
                        .build();

                Log.d(TAG, body.toString());
                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(@NonNull Call call, @NonNull IOException e) {
                        Log.d(TAG, "Error getting reports: " + e);
                        e.printStackTrace();
                        utilities.showToast("Error getting reports");
                    }

                    @Override
                    public void onResponse(@NonNull Call call, @NonNull final Response response) throws IOException {
                        Log.d(TAG, response.toString());
                        if (!response.isSuccessful()) {
                            try {
                                JSONObject responseBody = new JSONObject(response.body().string());
                                Log.d(TAG, responseBody.toString());
                                String errMessage = responseBody.getString("error");
                                Log.d(TAG, errMessage);
                                utilities.navigateTo(SignupActivity.class, errMessage);
                            } catch (JSONException e) {
                                Log.d(TAG, "Error getting reports: " + e);
                                e.printStackTrace();
                                utilities.showToast("Error getting reports");
                            }
                        } else {
                            try {
                                JSONObject responseBody = new JSONObject(response.body().string());
                                String userId = responseBody.getString("userId");

                                // Get a reference to SharedPreferences
                                SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), Context.MODE_PRIVATE);

                                SharedPreferences.Editor editor = sharedPreferences.edit();
                                editor.putString("loggedUserId", userId);
                                editor.apply();

                                utilities.navigateTo(AdminReports.class, getString(R.string.login_granted));

                            } catch (JSONException e) {
                                Log.d(TAG, "Error getting admin id: " + e);
                                e.printStackTrace();
                                utilities.showToast("Error getting admin id");
                            }
                        }
                    }
                });
            } else {
                Toast.makeText(AdminLoginActivity.this, "Please enter both values", Toast.LENGTH_SHORT).show();
            }
        });
    }
}