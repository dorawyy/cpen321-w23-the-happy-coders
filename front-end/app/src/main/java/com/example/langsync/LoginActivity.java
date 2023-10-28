package com.example.langsync;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.tasks.Task;
import com.google.android.material.button.MaterialButton;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

import java.io.IOException;
import java.net.URLEncoder;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class LoginActivity extends AppCompatActivity {

    private MaterialButton loginButton;
    private GoogleSignInClient mGoogleSignInClient;
    private final OkHttpClient client = new OkHttpClient();
    private static String TAG = "LoginActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.server_client_id))
                .requestEmail()
                .requestServerAuthCode(getString(R.string.server_client_id))
                .requestScopes(new Scope("https://www.googleapis.com/auth/calendar"))
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);
        loginButton = findViewById(R.id.login_button);
        
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                login();
            }
        });
    }

    ActivityResultLauncher<Intent> loginLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
        @Override
        public void onActivityResult(ActivityResult result) {
            Log.d(TAG, result.toString());
            if (result.getResultCode() == RESULT_OK) {
                Intent data = result.getData();
                Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                handleLoginResult(task);
            }
        }
    });

    private void login() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        loginLauncher.launch(signInIntent);
    }

    private void handleLoginResult(@NonNull Task<GoogleSignInAccount> task) {
        try {
            GoogleSignInAccount account = task.getResult(ApiException.class);
            String idToken = account.getIdToken();
            String authCode = account.getServerAuthCode();

            Log.d(TAG, "Account token: " + idToken);
            Log.d(TAG, "Account Auth Code:" + authCode);

            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json"), "{" +
                    "\"idToken\": \"" + idToken + "\"" +
                    "}");

//            // TODO(developer): send ID Token to server and validate
            String url = "http://10.0.2.2:8081/authentication/login/";
            Request request = new Request.Builder()
                    .url(url)
                    .post(requestBody)
                    .build();
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    e.printStackTrace();
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull final Response response) throws IOException {
                    if (!response.isSuccessful()) {
                        throw new IOException("Unexpected code " + response);
                    } else {
                        assert response.body() != null;
                        String jsonData = response.body().string();
                        Log.d(TAG, jsonData);
                        // TODO: Ensure token was authenticated, else tell them to login again
                    }
                }
            });
//
              updateUI(account);
        } catch (ApiException e) {
            Toast.makeText(LoginActivity.this,"handleSignInResult:error", Toast.LENGTH_SHORT).show();
            updateUI(null);
        }
    }

    private void updateUI(GoogleSignInAccount account){
        // TODO: Change this to move the user to the dashboard/swiping screen
        if (account == null) {
            Log.d(TAG, "There is no user signed in");
        } else {
            Log.d(TAG, "Pref name: " + account.getDisplayName());
        }
    }
}