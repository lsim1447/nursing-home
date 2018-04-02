package edu.cs.ubb.exam.util;

import org.springframework.util.MultiValueMap;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Szilu on 2017. 03. 29..
 */
public class PostDataConverter {
    public  PostDataConverter(){

    }
    public Map<String,String> getData(MultiValueMap params){
        Map<String,String> parameters = new HashMap<String,String>();
        Map<String, String> single = params.toSingleValueMap();
        String value = null;
        for (Map.Entry<String, String> entry : single.entrySet())
        {
            value = entry.getValue();
        }
        String[] result = value.split("------");

        for (int i = 0; i < result.length - 1; i++)
        {
            try {result[i] = result[i].split("name=")[1];
            }catch (Exception e){}
        }

        String val = null;
        String key = null;
        for (int i = 0; i < result.length - 1; i++)
        {
            try {
                key = result[i].split("\"")[1];
                val = result[i].split("\"")[2].replace("\n", "").replace("\r", "");
            }catch (Exception e){
                key = "";
                value = "";
            }
            parameters.put(key, val);
        }
        return parameters;
    }
}
