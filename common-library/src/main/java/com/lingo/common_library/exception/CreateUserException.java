package com.lingo.common_library.exception;


import com.lingo.common_library.utils.MessageUtils;

public class CreateUserException extends RuntimeException {
  private final String message;

  public CreateUserException(String message, Object... var) {
    this.message = MessageUtils.getMessage(message, var);
  }

  @Override
  public String getMessage() {
    return message;
  }
}