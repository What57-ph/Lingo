package com.lingo.testservice.repository;

import com.lingo.testservice.model.Answer;
import com.lingo.testservice.model.Question;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionId(long questionId);

}
