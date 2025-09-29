package com.lingo.testservice.model.dto.response;

import com.lingo.testservice.model.Question;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResAnswerDTO {

    long id;
    String content;
    String correct;
}
