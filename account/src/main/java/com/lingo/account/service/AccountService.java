package com.lingo.account.service;

import com.lingo.account.dto.identity.ReqAccount;
import com.lingo.account.dto.identity.TokenExchangeRequest;
import com.lingo.account.dto.request.ReqAccountDTO;
import com.lingo.account.dto.response.ResAccountDTO;
import com.lingo.account.mapper.AccountMapper;
import com.lingo.account.model.Account;
import com.lingo.account.repository.AccountRepository;
import com.lingo.account.repository.IdentityClient;
import com.lingo.common_library.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {
  private final AccountRepository accountRepository;
  private final IdentityClient identityClient;
  private final AccountMapper accountMapper;

  @Value("${idp.client-id}")
  @NonFinal
  String clientId;

  @Value("${idp.client-secret}")
  @NonFinal
  String clientSecret;

  public Account getAccount(String email) {
    return this.accountRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Account not found for email", email));
  }

  public ResAccountDTO createNewAccount(ReqAccountDTO request) {
    TokenExchangeRequest newToken = new TokenExchangeRequest("client_credentials", clientId, clientSecret, "openid");

    var token = this.identityClient.exchangeClientToken(newToken);

    var createAccountRes = identityClient.createAccount(
            "Bearer " + token.getAccessToken(),
            ReqAccount.builder()
                    .username(request.getUsername())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .enabled(true)
                    .emailVerified(false)
                    .credentials(List.of(ReqAccount.Credential.builder()
                            .type("password")
                            .temporary(false)
                            .value(request.getPassword())
                            .build()))
                    .build());

    String userId = extractUserId(createAccountRes);
    log.info("KEYCLOAK, User created with id: {}", userId);

    Account account = accountMapper.toModel(request, userId);
    this.accountRepository.save(account);

    return accountMapper.toResDTO(account);
  }


  private String extractUserId(ResponseEntity<?> response) {
    List<String> locations = response.getHeaders().get("Location");
    if (locations == null || locations.isEmpty()) {
      throw new IllegalStateException("Location header is missing in the response");
    }

    String location = locations.get(0);
    String[] splitedStr = location.split("/");
    return splitedStr[splitedStr.length - 1];
  }
}
