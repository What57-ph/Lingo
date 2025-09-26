package com.lingo.api_gateway.service;

import com.lingo.api_gateway.dto.identity.GoogleTokenRequest;
import com.lingo.api_gateway.dto.identity.RefreshTokenExchangeRequest;
import com.lingo.api_gateway.dto.identity.TokenExchangeRequest;
import com.lingo.api_gateway.dto.identity.TokenExchangeResponse;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "identity-service", url = "${idp.url}")
public interface AuthenClient {

  @PostMapping(value = "/realms/Lingo/protocol/openid-connect/token",
          consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
          produces = MediaType.APPLICATION_JSON_VALUE
  )
  TokenExchangeResponse exchangeClientToken(TokenExchangeRequest token);

  @PostMapping(value = "/realms/Lingo/protocol/openid-connect/token",
          consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
          produces = MediaType.APPLICATION_JSON_VALUE
  )
  TokenExchangeResponse refreshAccessToken(RefreshTokenExchangeRequest token);

  @PostMapping(value = "/realms/Lingo/protocol/openid-connect/token",
          consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
          produces = MediaType.APPLICATION_JSON_VALUE
  )
  TokenExchangeResponse exchangeGoogleToken(GoogleTokenRequest token);

}
