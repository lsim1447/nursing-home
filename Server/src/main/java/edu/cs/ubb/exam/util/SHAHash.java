package edu.cs.ubb.exam.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Created by Szilu on 2017. 03. 30..
 */
public class SHAHash {
    private MessageDigest md;
    private static SHAHash instance;
    private SHAHash() throws NoSuchAlgorithmException
    {
        md = MessageDigest.getInstance("SHA-256");
    }
    public static synchronized SHAHash getInstance() throws NoSuchAlgorithmException
    {
        if (instance == null) {
            instance = new SHAHash();
        }
        return instance;
    }
    public String encryption(String str)
    {
        md.update(str.getBytes());
        byte byteData[] = md.digest();

        StringBuffer hexString = new StringBuffer();
        for (int i=0;i<byteData.length;i++) {
            String hex=Integer.toHexString(0xff & byteData[i]);
            if(hex.length()==1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
