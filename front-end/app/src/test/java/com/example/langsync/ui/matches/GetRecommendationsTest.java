package com.example.langsync.ui.matches;

import org.junit.Test;
import java.io.IOException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import com.example.langsync.R;

import junit.framework.TestCase;

public class GetRecommendationsTest extends TestCase {

    private static final int NUM_TESTS = 10000;

    @Test
    public void testOkHttpCallMultipleTimes() throws InterruptedException {
        CountDownLatch latch;
        OkHttpClient client = new OkHttpClient();
        String baseUrl = "http://https://langsyncapp.canadacentral.cloudapp.azure.com/";
        Request request = new Request.Builder()
                .url(baseUrl + "recommendations/" + "654adb0923c9f072d0597e0a")
                .build();

        for (int i = 0; i < NUM_TESTS; i++) {
            latch = new CountDownLatch(1);

            long startTime = System.currentTimeMillis();

            CountDownLatch finalLatch = latch;
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(Call call, IOException e) {
                    finalLatch.countDown();
                }

                @Override
                public void onResponse(Call call, Response response) throws IOException {
                    long endTime = System.currentTimeMillis();
                    long latency = endTime - startTime;

                    assertTrue("Latency is within threshold. Latency: " + latency, latency < 200);
                    finalLatch.countDown();
                }
            });

            // Wait for the request to complete or timeout after 10 seconds
            assertTrue("Timeout", latch.await(10, TimeUnit.SECONDS));
        }
    }
}

