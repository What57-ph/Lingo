package com.lingo.testservice.model.dto.request.question;

import com.lingo.testservice.model.dto.request.answer.ReqAnswerDTO;
import jakarta.annotation.Nullable;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReqCreateQuestionDTO extends ReqQuestionDTO {
    String resourceContent;
    String explanationResourceContent;
    String testTitle;
    String commonTitle;
    List<ReqAnswerDTO> answers;
}
