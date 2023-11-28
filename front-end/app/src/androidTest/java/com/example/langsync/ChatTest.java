package com.example.langsync;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.contrib.RecyclerViewActions.actionOnItemAtPosition;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withParent;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import static java.lang.Thread.sleep;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.ViewInteraction;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.Until;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.UUID;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class ChatTest {

    @Rule
    public ActivityScenarioRule<LoginActivity> mActivityScenarioRule =
            new ActivityScenarioRule<>(LoginActivity.class);

    private UiDevice device;
    private static final int LAUNCH_TIMEOUT = 5000;

    @Before
    public void startMainActivityFromHomeScreen() {
        // Initialize UiDevice instance
        device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());

    }

    @Test
    public void chatTest() throws InterruptedException {
        ViewInteraction materialButton = onView(
                allOf(withId(R.id.login_button), withText("Login with Google"),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                2),
                        isDisplayed()));
        materialButton.perform(click());

        device.wait(Until.hasObject(By.pkg("com.google.android.gms").depth(0)), LAUNCH_TIMEOUT);

        UiObject2 googleLogin = device.findObject(
                By.clickable(true).res("com.google.android.gms:id/container")
        );

        if (googleLogin != null) {
            googleLogin.click();
        }

        device.wait(Until.hasObject(By.pkg("com.example.langsync").depth(0)), LAUNCH_TIMEOUT);

        sleep(2000);

        ViewInteraction matchesExist = onView(
                allOf(withParent(withParent(withId(R.id.nav_host_fragment_activity_main))),
                        isDisplayed()));
        matchesExist.check(matches(isDisplayed()));

        ViewInteraction navigateToChat = onView(withId(R.id.navigation_chat));
        navigateToChat.perform(click());

        ViewInteraction selectChat = onView(
                allOf(withId(R.id.chat_recycler_view),
                        childAtPosition(
                                withClassName(is("android.widget.LinearLayout")),
                                2)));
        selectChat.perform(actionOnItemAtPosition(0, click()));

        String testMessage = UUID.randomUUID().toString();

        ViewInteraction chatInput = onView(withId(R.id.msg_input));
        chatInput.perform(replaceText(testMessage), closeSoftKeyboard());

        ViewInteraction sendMessage = onView(withId(R.id.send_msg));
        sendMessage.perform(click());

        sleep(1000);

        ViewInteraction messagesExist = onView(
                allOf(withId(R.id.msg_recycler_view),
                        withParent(withParent(withId(android.R.id.content))),
                        isDisplayed()));
        messagesExist.check(matches(isDisplayed()));

        ViewInteraction aiOn = onView(withId(R.id.ai_switch));
        aiOn.perform(click());

        chatInput.perform(replaceText("AI Test message"));
        chatInput.perform(closeSoftKeyboard());

        sendMessage.perform(click());

        ViewInteraction goBack = onView(withId(R.id.back_btn));
        goBack.perform(click());

        selectChat.perform(actionOnItemAtPosition(0, click()));

    }

    private static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup && parentMatcher.matches(parent)
                        && view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }
}
