plugins {
    id("com.android.application")
}

android {
    namespace = "com.example.langsync"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.langsync"
        minSdk = 29
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {

    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.10.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.6.2")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2")
    implementation("androidx.navigation:navigation-fragment:2.7.5")
    implementation("androidx.navigation:navigation-ui:2.7.5")
    implementation("androidx.tracing:tracing:1.1.0")
    implementation("io.socket:socket.io-client:2.0.0") {
        exclude("org.json","json")
    }
    implementation("com.github.bumptech.glide:glide:4.12.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.0-alpha01")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.0-alpha01")
    androidTestImplementation("androidx.test:runner:1.5.2")
    androidTestImplementation("androidx.test:rules:1.6.0-alpha01")
    androidTestImplementation("androidx.test.uiautomator:uiautomator:2.3.0-alpha05")
    implementation("io.agora.rtc:full-sdk:4.0.1")
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
    implementation("com.squareup.picasso:picasso:2.71828")
    implementation("com.github.sundeepk:compact-calendar-view:3.0.0")
    implementation("com.google.android.gms:play-services-auth:20.7.0")
    androidTestImplementation("androidx.test.espresso:espresso-contrib:3.5.1")

}