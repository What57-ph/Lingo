package com.lingo.account.service;

import com.lingo.account.dto.request.ReqAccountDTO;
import com.lingo.account.dto.response.ResAccountDTO;

public interface IAccountService {
  ResAccountDTO createNewAccount(ReqAccountDTO request);
}
