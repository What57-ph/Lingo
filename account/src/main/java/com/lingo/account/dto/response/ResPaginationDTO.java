package com.lingo.account.dto.response;

import lombok.Data;
import lombok.Setter;

@Data
public class ResPaginationDTO {
    private Meta meta;
    private Object result;

    @Data
    public static class Meta {
      private int page;
      private int pageSize;
      private int pages;
      private long total;
    }
  }
