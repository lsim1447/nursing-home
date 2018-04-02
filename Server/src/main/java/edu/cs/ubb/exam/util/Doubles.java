package edu.cs.ubb.exam.util;

/**
 * Created by Szilu on 2017. 04. 06..
 */
public class Doubles {
    public Double setPrecisionString(String number, int precision){
        return Double.parseDouble(String.format("%." + precision + "f", Double.parseDouble(number)).replace(",", "."));
    }
    public Double setPrecisionDouble(Double number, int precision){
        return Double.parseDouble(String.format("%." + precision + "f", number).replace(",", "."));
    }
}
