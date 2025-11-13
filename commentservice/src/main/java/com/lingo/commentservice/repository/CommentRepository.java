package com.lingo.commentservice.repository;

import com.lingo.commentservice.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByReplyId(Long replyId);
    List<Comment> findByTestId(Long testId);
}
