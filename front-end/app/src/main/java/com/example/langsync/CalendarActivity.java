package com.example.langsync;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.langsync.util.AuthenticationUtilities;
import com.github.sundeepk.compactcalendarview.CompactCalendarView;
import com.github.sundeepk.compactcalendarview.domain.Event;
import com.google.android.material.button.MaterialButton;

import org.json.JSONArray;
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

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class CalendarActivity extends AppCompatActivity {
    private TextView monthTextView;
    private CompactCalendarView compactCalendarView;
    private String otherUserId = null;
    private String userId;
    private String TAG = "CalendarView";
    private boolean isInitialCreation = true;
    private AuthenticationUtilities utilities = new AuthenticationUtilities(CalendarActivity.this);

    // ChatGPT Usage: no
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calendar);

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

        getEvents();

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


        // define a listener to receive callbacks when certain events happen.
        compactCalendarView.setListener(new CompactCalendarView.CompactCalendarViewListener() {
            @Override
            public void onDayClick(Date dateClicked) {
                List<Event> events = compactCalendarView.getEvents(dateClicked);
                updateEventsDisplay(dateClicked);
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
            getEvents();
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
            for (Event event : events) {
                JSONObject eventObj = (JSONObject) event.getData();
                View eventItemView = getLayoutInflater().inflate(R.layout.event_item, null);

                TextView partnerTextView = eventItemView.findViewById(R.id.event_partner);
                TextView startTimeTextView = eventItemView.findViewById(R.id.event_time);
                LinearLayout mainCardSection = eventItemView.findViewById(R.id.event_item_main_content);
                try {
                    String partnerName = eventObj.getString("otherUserName");
                    String eventStartTimeRaw = eventObj.getString("startTime");
                    String chatroomId = eventObj.getString("chatroomId");

                    Date eventDate = stringToDate(eventStartTimeRaw);
                    SimpleDateFormat dateFormat = new SimpleDateFormat("h:mma, d MMMM yyyy", Locale.ENGLISH);
                    String eventStartTime = dateFormat.format(eventDate);

                    partnerTextView.setText(partnerName);
                    startTimeTextView.setText(eventStartTime);
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
            noEventsTextView.setText("No events for this date.");
            scrollView.addView(noEventsTextView);
        }
    }

    // ChatGPT Usage: no
    private Date stringToDate(String dateStr) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        Date date = dateFormat.parse(dateStr);
        return date;
    }

    // ChatGPT Usage: no
    private void getEvents(){
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

                        LocalDate currentDate = LocalDate.now();
                        Date date = Date.from(currentDate.atStartOfDay()
                                .atZone(java.time.ZoneId.systemDefault())
                                .toInstant());
                        compactCalendarView.setCurrentDate(date);
                        runOnUiThread(() -> {
                            updateEventsDisplay(date);
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
}