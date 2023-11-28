package com.example.langsync.util;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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

  public static List<String> jsonArrayToList(JSONArray list){
    List<String> array = new ArrayList<>();
    for(int i = 0; i < list.length() ; i++){
      array.add(list.opt(i).toString());
    }
    return array;
  }

  public static ArrayList<String> interestObjToList(JSONObject interestsObjects) throws JSONException{
    ArrayList<String> array = new ArrayList<>();

    for (Iterator<String> it = interestsObjects.keys(); it.hasNext(); ) {
     String key = it.next();
     if(interestsObjects.getBoolean(key)){
      array.add(capitalizeFirstLetter(key));
     }
    }
    return array;
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
