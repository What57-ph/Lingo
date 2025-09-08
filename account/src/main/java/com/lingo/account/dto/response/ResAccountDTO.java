package com.lingo.account.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResAccountDTO {

  private Long id;
  private String keycloakId;
  private String userId;
  private String email;
  private String username;
  private String firstName;
  private String lastName;
//  private LocalDate dob;
  private String name;
}
