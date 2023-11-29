package com.example.langsync;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.langsync.util.AuthenticationUtilities;
import com.github.sundeepk.compactcalendarview.CompactCalendarView;
import com.github.sundeepk.compactcalendarview.domain.Event;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.tasks.Task;
import com.google.android.material.button.MaterialButton;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Comparator;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CalendarActivity extends AppCompatActivity {
    private TextView monthTextView;
    private CompactCalendarView compactCalendarView;
    private String otherUserId = null;
    private String userId;
    private String TAG = "CalendarView";
    private Date selectedDate;
    private String selectedEventId;
    private boolean isInitialCreation = true;
    private AuthenticationUtilities utilities = new AuthenticationUtilities(CalendarActivity.this);
    private GoogleSignInClient mGoogleSignInClient;
    // ChatGPT Usage: no
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestServerAuthCode(getString(R.string.server_client_id))
                .requestScopes(new Scope("https://www.googleapis.com/auth/calendar"))
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        userId = sharedPreferences.getString("loggedUserId", null);

        compactCalendarView = (CompactCalendarView) findViewById(R.id.compactcalendar_view);
        compactCalendarView.setFirstDayOfWeek(Calendar.MONDAY);

        MaterialButton scheduleMeetingButton = findViewById(R.id.schedule_meeting_button);
        TextView partnerName = findViewById(R.id.partner_name);
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
           try {
               otherUserId = extras.getString("otherUserId");
               String otherUserName = extras.getString("otherUserName");
               partnerName.setText("with " + otherUserName);
               scheduleMeetingButton.setText("Schedule a session with " + otherUserName);
               scheduleMeetingButton.setOnClickListener(v -> {
                   goToCalendarForm();
               });
           } catch (Exception e){
               scheduleMeetingButton.setVisibility(View.GONE);
               partnerName.setVisibility(View.GONE);
           }
        } else{
            scheduleMeetingButton.setVisibility(View.GONE);
            partnerName.setVisibility(View.GONE);
        }

        getEvents(getTodayDate());

        TextView nextMonthButton = findViewById(R.id.next_month_button);
        TextView previousMonthButton = findViewById(R.id.previous_month_button);
        monthTextView = findViewById(R.id.month_text_view);
        updateMonthTextView();

        nextMonthButton.setOnClickListener(v -> {
            goToNextMonth();
        });

        previousMonthButton.setOnClickListener(v -> {
            goToPreviousMonth();
        });

        compactCalendarView.setListener(new CompactCalendarView.CompactCalendarViewListener() {
            @Override
            public void onDayClick(Date dateClicked) {
                List<Event> events = compactCalendarView.getEvents(dateClicked);
                updateEventsDisplay(dateClicked);
                selectedDate = dateClicked;
                Log.d(TAG, "Day was clicked: " + dateClicked + " with events " + events);
            }

            @Override
            public void onMonthScroll(Date firstDayOfNewMonth) {
                Log.d(TAG, "Month was scrolled to: " + firstDayOfNewMonth);
                updateMonthTextView();
            }
        });
    }

    // ChatGPT Usage: no
    @Override
    protected void onResume() {
        super.onResume();
        if (!isInitialCreation) {
            getEvents(selectedDate);
        } else {
            isInitialCreation = false;
        }
    }

    // ChatGPT Usage: no
    private void updateMonthTextView(){
        Date firstMonthDate = compactCalendarView.getFirstDayOfCurrentMonth();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM, YYYY", Locale.ENGLISH);
        String monthString = dateFormat.format(firstMonthDate);
        monthTextView.setText(monthString);
        updateEventsDisplay(firstMonthDate);
    }

    // ChatGPT Usage: no
    private void goToNextMonth(){
        compactCalendarView.scrollRight();
        updateMonthTextView();
    }

    // ChatGPT Usage: no
    private void goToPreviousMonth(){
        compactCalendarView.scrollLeft();
        updateMonthTextView();
    }

    // ChatGPT Usage: no
    private void goToCalendarForm(){
        Intent intent = new Intent(getApplicationContext(), CalendarFormActivity.class);
        intent.putExtra("otherUserId", otherUserId);
        startActivity(intent);
    }

    // ChatGPT Usage: no
    private void updateEventsDisplay(Date date){
        List<Event> events = compactCalendarView.getEvents(date);
        LinearLayout  scrollView = findViewById(R.id.scroll_view_layout); // Replace with your ScrollView's ID

        scrollView.removeAllViews(); // Clear previous views

        if (events != null && !events.isEmpty()) {
            // Sort events by start time before displaying
            events.sort(Comparator.comparing(event -> {
                JSONObject eventObj = (JSONObject) event.getData();
                try {
                    String eventStartTimeRaw = eventObj.getString("startTime");
                    SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mma, d MMMM yyyy", Locale.ENGLISH);
                    Date eventStartDate = stringToDate(eventStartTimeRaw);
                    return dateFormat.format(eventStartDate);
                } catch (Exception e) {
                    e.printStackTrace();
                    return "";
                }
            }));

            for (Event event : events) {
                JSONObject eventObj = (JSONObject) event.getData();
                View eventItemView = getLayoutInflater().inflate(R.layout.event_item, null);

                TextView partnerTextView = eventItemView.findViewById(R.id.event_partner);
                TextView startTimeTextView = eventItemView.findViewById(R.id.event_start_time);
                TextView endTimeTextView = eventItemView.findViewById(R.id.event_end_time);
                ImageView deleteButton = eventItemView.findViewById(R.id.delete_event_button);
                LinearLayout mainCardSection = eventItemView.findViewById(R.id.event_item_main_content);
                try {
                    String partnerName = eventObj.getString("otherUserName");
                    String eventStartTimeRaw = eventObj.getString("startTime");
                    String chatroomId = eventObj.getString("chatroomId");
                    String eventEndTimeRaw = eventObj.getString("endTime");
                    String eventId = eventObj.getString("_id");

                    SimpleDateFormat dateFormat = new SimpleDateFormat("h:mma, d MMMM yyyy", Locale.ENGLISH);
                    Date eventStartDate = stringToDate(eventStartTimeRaw);
                    Date eventEndDate = stringToDate(eventEndTimeRaw);
                    String eventStartTime = dateFormat.format(eventStartDate);
                    String eventEndTime = dateFormat.format(eventEndDate);

                    startTimeTextView.setText(eventStartTime);
                    endTimeTextView.setText(eventEndTime);
                    partnerTextView.setText(partnerName);

                    deleteButton.setOnClickListener(v -> {
                        deleteEvent(eventId, partnerName);
                    });

                    mainCardSection.setOnClickListener(v -> {
                        Intent intent = new Intent(CalendarActivity.this, VideoCallActivity.class);
                        intent.putExtra(getString(R.string.channel_key), chatroomId);
                        startActivity(intent);
                    });

                    scrollView.addView(eventItemView);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } else {
            // Display a message or handle the case when there are no events
            TextView noEventsTextView = new TextView(this);
            noEventsTextView.setText("No sessions for this date.");
            noEventsTextView.setTextSize(25);
            noEventsTextView.setPadding(40, 20, 0,0);

            scrollView.addView(noEventsTextView);
        }
    }

    // ChatGPT Usage: no
    private void deleteEvent(String eventId, String partnerName){
        AlertDialog.Builder builder = new AlertDialog.Builder(CalendarActivity.this);
        builder.setTitle("Delete event with " + partnerName);
        builder.setMessage("If you created this meeting, it will be deleted on both users calendars.\nOtherwise, you will reject the invite.");
        builder.setCancelable(true);
        builder.setPositiveButton("Delete", (dialog, which) -> {
            deleteEventRequest(eventId);
        });
        builder.setNegativeButton("Cancel", (dialog, which) -> {
            dialog.cancel();
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    //ChatGPT Usage: no
    private void deleteEventRequest(String eventId){
        Intent deleteEventIntent = mGoogleSignInClient.getSignInIntent();
        selectedEventId = eventId;
        deleteEventIntent.putExtra("eventId", eventId);
        deleteEventLauncher.launch(deleteEventIntent);
    }

    ActivityResultLauncher<Intent> deleteEventLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new ActivityResultCallback<ActivityResult>() {
        @Override
        public void onActivityResult(ActivityResult result) {
            if (result.getResultCode() == RESULT_OK) {
                Intent data = result.getData();
                Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                handleDeleteEvent(task);
            }
        }
    });

    //ChatGPT Usage: no
    private void handleDeleteEvent(@NonNull Task<GoogleSignInAccount> task){
        try {
            GoogleSignInAccount account = task.getResult(ApiException.class);
            String authCode = account.getServerAuthCode();
            String eventId = selectedEventId;
            Log.d(TAG,"EventId: " + eventId);

            JSONObject bodyObject;

            try {
                bodyObject = getDeleteRequestBody(authCode);
            }catch (Exception e){
                utilities.showToast(getString(R.string.error_delete_events));
                return;
            }
            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            RequestBody body = RequestBody.create(bodyObject.toString(), JSON);
            Log.d(TAG, "Body: " + bodyObject.toString());
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                    .url(getString(R.string.base_url) + "events/" + eventId)
                    .delete(body)
                    .build();

            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    Log.d(TAG, "Error deleting event");
                    utilities.showToast(getString(R.string.error_delete_events));
                    e.printStackTrace();
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                    if(response.isSuccessful()){
                        try {
                            JSONObject responseBody = new JSONObject(response.body().string());
                            String message = responseBody.getString("message");
                            utilities.showToast(message);
                        } catch(Exception e) {
                            Log.d(TAG, e.toString());
                            utilities.showToast("Event deleted");
                        }
                        getEvents(selectedDate);
                    }else{
                        Log.d(TAG, "Response not successfull");
                        utilities.showToast(getString(R.string.error_delete_events));
                    }
                }
            });
        } catch(Exception e){
            utilities.showToast(getString(R.string.error_delete_events));
        }
    }

    // ChatGPT Usage: no
    private JSONObject getDeleteRequestBody(String authCode) throws JSONException {
        JSONObject body = new JSONObject();

        body.put("authCode", authCode);

        return body;
    }

    // ChatGPT Usage: no
    private Date stringToDate(String dateStr) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        Date date = dateFormat.parse(dateStr);
        return date;
    }

    // displayDate: date to be displayed after getting users
    // ChatGPT Usage: no
    private void getEvents(Date displayDate){
        compactCalendarView.removeAllEvents();
        OkHttpClient client = new OkHttpClient();
        String params = otherUserId != null ? userId + "/" + otherUserId : userId;
        Request request = new Request.Builder()
                .url(getString(R.string.base_url) + "events/" + params)
                .get()
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d(TAG, "Error getting events");
                Log.d(TAG, Objects.requireNonNull(e.getMessage()));
                utilities.showToast("Error getting events");
                e.printStackTrace();
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if(response.isSuccessful()){
                    try {
                        JSONObject responseBody = new JSONObject(response.body().string());
                        JSONArray eventsArray = new JSONArray(responseBody.getString("events"));
                        Log.d(TAG, responseBody.toString());
                        for(int i = 0; i < eventsArray.length(); i++) {
                            JSONObject eventObj =  eventsArray.getJSONObject(i);
                            String eventStartTime = eventObj.getString("startTime");
                            Date eventDate = stringToDate(eventStartTime);
                            Event ev = new Event(Color.GREEN, eventDate.getTime(), eventObj);
                            compactCalendarView.addEvent(ev);
                        }

                        compactCalendarView.setCurrentDate(displayDate);
                        selectedDate = displayDate;
                        runOnUiThread(() -> {
                            updateEventsDisplay(displayDate);
                        });
                    } catch(Exception e) {
                        Log.d(TAG, e.toString());
                        utilities.showToast(getString(R.string.error_get_events));
                    }
                }else{
                    Log.d(TAG, "Response not successfull");
                    utilities.showToast(getString(R.string.error_get_events));
                }
            }
        });
    }

    private Date getTodayDate(){
        LocalDate currentDate = LocalDate.now();
        Date today = Date.from(currentDate.atStartOfDay()
                .atZone(java.time.ZoneId.systemDefault())
                .toInstant());
        return today;
    }
}