package com.example.langsync;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.Espresso.pressBack;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.action.ViewActions.scrollTo;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.contrib.RecyclerViewActions.actionOnItemAtPosition;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withContentDescription;
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

@LargeTest
@RunWith(AndroidJUnit4.class)
public class ReportsTest {

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
    public void reportsTest() throws InterruptedException {
        ViewInteraction login = onView(
                allOf(withId(R.id.login_button), withText("Login with Google"),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                2),
                        isDisplayed()));
        login.perform(click());

        device.wait(Until.hasObject(By.pkg("com.google.android.gms").depth(0)), LAUNCH_TIMEOUT);

        UiObject2 googleLogin = device.findObject(
                By.clickable(true).res("com.google.android.gms:id/container")
        );

        if (googleLogin != null) {
            googleLogin.click();
        }

        device.wait(Until.hasObject(By.pkg("com.example.langsync").depth(0)), LAUNCH_TIMEOUT);

        sleep(2000);

        ViewInteraction navigateToChat = onView(withId(R.id.navigation_chat));
        navigateToChat.perform(click());

        ViewInteraction selectChat = onView(
                allOf(withId(R.id.chat_recycler_view),
                        childAtPosition(
                                withClassName(is("android.widget.LinearLayout")),
                                2)));
        selectChat.perform(actionOnItemAtPosition(0, click()));

        ViewInteraction reportUser = onView(
                allOf(withId(R.id.report_user),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.chat_header),
                                        0),
                                4),
                        isDisplayed()));
        reportUser.perform(click());

        ViewInteraction reportedReason = onView(
                allOf(childAtPosition(
                                allOf(withId(androidx.appcompat.R.id.custom),
                                        childAtPosition(
                                                withId(androidx.appcompat.R.id.customPanel),
                                                0)),
                                0),
                        isDisplayed()));
        reportedReason.check(matches(isDisplayed()));
        reportedReason.perform(replaceText("This user was mean"), closeSoftKeyboard());

        ViewInteraction submitReport = onView(
                allOf(withId(android.R.id.button1), withText("Report"),
                        childAtPosition(
                                childAtPosition(
                                        withId(androidx.appcompat.R.id.buttonPanel),
                                        0),
                                3)));
        submitReport.perform(click());

        ViewInteraction goBack = onView(
                allOf(withId(R.id.back_btn),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.chat_header),
                                        0),
                                0),
                        isDisplayed()));
        goBack.perform(click());

        pressBack();
        pressBack();

        ViewInteraction goToAdminLogin = onView(
                allOf(withId(R.id.admin_login), withText("Have an admin access code? Login here"),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                4),
                        isDisplayed()));
        goToAdminLogin.perform(click());

        ViewInteraction accessCode = onView(withId(R.id.access_code_value));
        accessCode.perform(replaceText("1234"), closeSoftKeyboard());

        ViewInteraction adminEmail = onView(withId(R.id.email_value));
        adminEmail.perform(replaceText("adminaccess@gmail.com"), closeSoftKeyboard());

        ViewInteraction loginAdmin = onView(
                allOf(withId(R.id.admin_login), withText("Login"),
                        childAtPosition(
                                childAtPosition(
                                        withId(android.R.id.content),
                                        0),
                                2),
                        isDisplayed()));
        loginAdmin.perform(click());

        sleep(2000);

        ViewInteraction reportsExist = onView(withId(R.id.reports_recycler_view));
        reportsExist.check(matches(isDisplayed()));
        
        ViewInteraction removeReport = onView(withId(R.id.remove_report));
        removeReport.perform(click());
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
