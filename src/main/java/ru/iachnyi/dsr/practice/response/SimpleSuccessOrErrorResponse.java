package ru.iachnyi.dsr.practice.response;

import lombok.Data;

@Data
public class SimpleSuccessOrErrorResponse {
    private String success;
    private String error;
}
