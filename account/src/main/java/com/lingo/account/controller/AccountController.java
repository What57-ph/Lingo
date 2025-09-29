package com.lingo.account.controller;

import com.lingo.account.dto.request.ReqAccountDTO;
import com.lingo.account.dto.request.ReqAccountGGDTO;
import com.lingo.account.dto.request.ReqUpdateAccountDTO;
import com.lingo.account.dto.response.ResAccountDTO;
import com.lingo.account.dto.response.ResPaginationDTO;
import com.lingo.account.model.Account;
import com.lingo.account.service.AccountService;
import com.lingo.common_library.exception.CreateUserException;
import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/account")
public class AccountController {
  private AccountService accountService;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @PostMapping
  public ResponseEntity<ResAccountDTO> createNewAccount(@RequestBody ReqAccountDTO request) throws CreateUserException {
    return ResponseEntity.ok(this.accountService.createNewAccount(request));
  }

  @GetMapping
  @Operation(summary = "Find all accounts", description = "Return 200 if getting all account successfully")
  @ApiResponses({
          @ApiResponse(responseCode = "200", description = "All accounts found", content = @Content(mediaType = "application/json")),
          @ApiResponse(responseCode = "400", description = "Wrong/not valid accounts", content = @Content(mediaType = "application/json")),
  })
  public ResponseEntity<ResPaginationDTO> getAllAccounts(@Filter Specification<Account> spec, Pageable pageable) {
    return ResponseEntity.ok(this.accountService.getAllAccounts(spec, pageable));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Find account by id", description = "Return 200 if getting all account successfully")
  @ApiResponses({
          @ApiResponse(responseCode = "200", description = "Account found", content = @Content(mediaType = "application/json")),
          @ApiResponse(responseCode = "400", description = "Wrong/not valid account", content = @Content(mediaType = "application/json")),
  })
  public ResponseEntity<ResAccountDTO> getAccount(@PathVariable Long id){
    return ResponseEntity.ok(this.accountService.getAccount(id));
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete account by id", description = "Return 200 if the account deleted successfully")
  @ApiResponses({
          @ApiResponse(responseCode = "200", description = "Account deleted", content = @Content(mediaType = "application/json")),
          @ApiResponse(responseCode = "400", description = "Wrong/not valid accounts", content = @Content(mediaType = "application/json")),
  })
  public ResponseEntity<String> deleteAccount(@PathVariable Long id) {
    this.accountService.deleteAccount(id);
    return ResponseEntity.ok("Account deleted successfully");
  }

  @PutMapping()
  @Operation(summary = "Update account ", description = "Return 200 if the account updated successfully")
  @ApiResponses({
          @ApiResponse(responseCode = "200", description = "Account updated", content = @Content(mediaType = "application/json")),
          @ApiResponse(responseCode = "400", description = "Wrong/not valid accounts", content = @Content(mediaType = "application/json")),
  })
  public ResponseEntity<ResAccountDTO> updateAccount(@RequestBody ReqUpdateAccountDTO req ) {
    return ResponseEntity.ok(this.accountService.updateAccount(req));
  }

  @PostMapping("/gg")
  public ResponseEntity<String> createAccountGG(@RequestBody ReqAccountGGDTO req ) {
    ResAccountDTO dto = this.accountService.createAccountGG(req);

    return ResponseEntity.ok("Account has been created!");
  }
}
