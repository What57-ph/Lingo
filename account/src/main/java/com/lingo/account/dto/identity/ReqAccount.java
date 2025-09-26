package com.lingo.account.dto.identity;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReqAccount {
  String username;
  String firstName;
  String lastName;
  String email;
  boolean emailVerified;
  boolean enabled;
  List<Credential> credentials;

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Builder
  public static class Credential {
    String type;
    String value;
    boolean temporary;
  }

}
