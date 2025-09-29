package com.lingo.api_gateway.dto.identity;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshTokenExchangeRequest {
  String grant_type;
  String client_id;
  String client_secret;
  String refresh_token;
}
