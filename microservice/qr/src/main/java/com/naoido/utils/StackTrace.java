package com.naoido.utils;

import java.io.PrintWriter;
import java.io.StringWriter;

public class StackTrace {
    private static final String STAGING = System.getenv("STAGING");
    private static final boolean isDevelop = STAGING != null && STAGING.equals("develop");

    public static String getStackTrace(Exception e) {
        if (!isDevelop) return e.getLocalizedMessage();

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);

        return sw.toString();
    }
}
