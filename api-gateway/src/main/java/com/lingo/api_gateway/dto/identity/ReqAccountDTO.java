package com.lingo.api_gateway.dto.identity;

import lombok.Data;

@Data
public class ReqAccountDTO {
  private String username;
  private String password;
}
