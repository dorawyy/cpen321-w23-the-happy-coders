package com.example.langsync;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withParent;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.core.app.ApplicationProvider;
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
import org.hamcrest.core.IsInstanceOf;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class MatchingTests {

    @Rule
    public ActivityScenarioRule<LoginActivity> mActivityScenarioRule = new ActivityScenarioRule<>(LoginActivity.class);
    private static final int LAUNCH_TIMEOUT = 5000;
    private UiDevice device;

    @Before
    public void startMainActivityFromHomeScreen() {
        // Initialize UiDevice instance
        device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());

    }
    @Test
    public void matchingTests() {
        ViewInteraction login = onView(withId(R.id.login_button));
        login.perform(click());

        device.wait(Until.hasObject(By.pkg("com.google.android.gms").depth(0)), LAUNCH_TIMEOUT);

        UiObject2 googleLogin = device.findObject(
                By.clickable(true).res("com.google.android.gms:id/container")
        );

        if (googleLogin != null) {
            googleLogin.click();
        }

        ViewInteraction matchExists = onView(withId(R.id.match_card));
        matchExists.check(matches(isDisplayed()));

        ViewInteraction dislikeMatch = onView(withId(R.id.dislike_match));
        dislikeMatch.perform(click());

        matchExists = onView(withId(R.id.match_card));
        matchExists.check(matches(isDisplayed()));

        ViewInteraction likeMatch = onView(withId(R.id.like_match));
        likeMatch.perform(click());

        ViewInteraction navigationChat = onView(withId(R.id.navigation_chat));
        navigationChat.perform(click());

        ViewInteraction navigationMatches = onView(withId(R.id.navigation_matches));
        navigationMatches.perform(click());

        matchExists = onView(withId(R.id.match_card));
        matchExists.check(matches(isDisplayed()));
    }

}
