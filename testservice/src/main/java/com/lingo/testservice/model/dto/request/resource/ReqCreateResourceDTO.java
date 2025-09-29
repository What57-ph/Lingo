package com.lingo.testservice.model.dto.request.resource;

import com.lingo.testservice.utils.enums.MediaResourceCategory;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReqCreateResourceDTO extends ReqMediaResourceDTO {
    MediaResourceCategory category;

}
