package com.example.langsync.util;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

public final class JSONObjectUtilities {

 // ChatGPT usage: no
  public static String jsonArrayToString(JSONArray list){
   if ( list == null || list.length() == 0) return "";

   StringBuilder sb = new StringBuilder();
   sb.append(list.opt(0));

   for(int i = 1; i < list.length() - 1; i++){
    sb.append(", ");
    sb.append(list.opt(i));
   }

   if(list.length() > 1){
    sb.append(" and ");
    sb.append(list.opt(list.length() - 1));
   }
   return sb.toString();
  }

  // ChatGPT Usage: no
  public static String getInterestsString(JSONObject interestsObjects) throws JSONException {
   JSONArray array = new JSONArray();

   for (Iterator<String> it = interestsObjects.keys(); it.hasNext(); ) {
    String key = it.next();
    if(interestsObjects.getBoolean(key) == true){
     array.put(capitalizeFirstLetter(key));
    }
   }

   return jsonArrayToString(array);
  }

  // ChatGPT usage: no
  private static String capitalizeFirstLetter(String word) {
   return Character.toUpperCase(word.charAt(0)) + word.substring(1);
  }
}
