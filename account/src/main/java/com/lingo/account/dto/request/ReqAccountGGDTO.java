package com.lingo.account.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ReqAccountGGDTO {
  private String sub;
  private String email;

  @JsonProperty("preferred_username")
  private String preferredUsername;
}
