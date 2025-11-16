package com.lingo.commentservice.httpclient;

import com.lingo.commentservice.dto.response.ResAccountDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.awt.*;

@FeignClient(name = "account-service", url = "http://localhost:8080/api/v1/account")
public interface AccountClient {
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResAccountDTO getAccountInfo(@PathVariable("id") String id);
}
