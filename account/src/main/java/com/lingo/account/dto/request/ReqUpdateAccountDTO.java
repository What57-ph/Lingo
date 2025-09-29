package com.lingo.account.dto.request;

import lombok.Data;

@Data
public class ReqUpdateAccountDTO {
  private Long id;
  private String username;
  private String firstName;
  private String lastName;
}
