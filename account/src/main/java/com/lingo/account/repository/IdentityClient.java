package com.lingo.account.repository;

import com.lingo.account.dto.identity.ReqAccount;
import com.lingo.account.dto.identity.TokenExchangeRequest;
import com.lingo.account.dto.identity.TokenExchangeResponse;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "identity-service", url = "${idp.url}")
public interface IdentityClient {

  @PostMapping(value = "/realms/Lingo/protocol/openid-connect/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
  TokenExchangeResponse exchangeClientToken(@QueryMap TokenExchangeRequest token);

//  @PostMapping(value = "/admin/realms/Lingo/users", consumes = MediaType.APPLICATION_JSON_VALUE)
//  ResponseEntity<?> createAccount(@RequestHeader("authorization") String token, @RequestBody ReqAccount reqAccount );

  @PostMapping(value = "/admin/realms/Lingo/users", consumes = MediaType.APPLICATION_JSON_VALUE)
  ResponseEntity<?> createAccount(@RequestHeader("authorization") String token, @RequestBody ReqAccount param);
}
