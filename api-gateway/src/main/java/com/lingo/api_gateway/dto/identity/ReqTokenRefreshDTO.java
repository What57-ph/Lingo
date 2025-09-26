package com.lingo.api_gateway.dto.identity;

import lombok.Data;

@Data
public class ReqTokenRefreshDTO {
  private String refresh_token;
}
