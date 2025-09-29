package com.lingo.api_gateway.dto.identity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TokenExchangeRequest {
  String grant_type;
  String client_id;
  String client_secret;
  String scope;
  String username;
  String password;
}
