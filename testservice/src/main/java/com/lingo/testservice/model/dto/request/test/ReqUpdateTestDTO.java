package com.lingo.testservice.model.dto.request.test;

import jakarta.annotation.Nullable;
import lombok.*;
import lombok.experimental.FieldDefaults;

@EqualsAndHashCode(callSuper = true)
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReqUpdateTestDTO extends ReqTestDTO {
    @Nullable
    String mediaURL;
}
