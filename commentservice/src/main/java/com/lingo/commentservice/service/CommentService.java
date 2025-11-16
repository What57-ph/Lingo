package com.lingo.commentservice.service;

import com.lingo.commentservice.dto.request.RequestCommentDTO;
import com.lingo.commentservice.dto.response.ResAccountDTO;
import com.lingo.commentservice.dto.response.ResponseCommentDTO;
import com.lingo.commentservice.enums.CommentStatus;
import com.lingo.commentservice.enums.CommentType;
import com.lingo.commentservice.httpclient.AccountClient;
import com.lingo.commentservice.mapper.CommentMapper;
import com.lingo.commentservice.model.Comment;
import com.lingo.commentservice.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

public interface CommentService {
    ResponseCommentDTO add(RequestCommentDTO dto);
    ResponseCommentDTO update(RequestCommentDTO dto, long id);
    void delete(long id);
    List<ResponseCommentDTO> getAll();
    ResponseCommentDTO getOne(long id) throws Exception;
    List<ResponseCommentDTO> getAnswerOfComment(long id);
    List<ResponseCommentDTO> getCommentsOfTest(long testId);
}

@Service
@RequiredArgsConstructor
@Slf4j
class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final AccountClient accountClient;

    @Override
    @jakarta.transaction.Transactional
    @CacheEvict(value = "commentsByTest", key = "#dto.testId")
    public ResponseCommentDTO add(RequestCommentDTO dto) {
        Comment comment = commentMapper.toComment(dto);
        comment.setStatus(CommentStatus.ACTIVE);
        comment.setType(dto.getType());

        if (dto.getReplyId() != null) {
            comment.setReply(commentRepository.findById(dto.getReplyId()).orElse(null));
        }

        Comment saved = commentRepository.save(comment);
        return commentMapper.toCommentResponse(saved);
    }

    @Override
    @CacheEvict(value = "commentsByTest", key = "#dto.testId")
    public ResponseCommentDTO update(RequestCommentDTO dto, long id) {
        Comment existing = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        existing.setContent(dto.getContent());
        existing.setType(dto.getType());
        Comment updated = commentRepository.save(existing);

        return commentMapper.toCommentResponse(updated);
    }

    @Override
    @CacheEvict(value = "commentsByTest", key = "#existing.testId")
    public void delete(long id) {
        Comment existing = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
        List<Comment> comments= commentRepository.findByReplyId(id);
        comments.stream().peek(comment -> comment.setStatus(CommentStatus.INACTIVE)).collect(Collectors.toList());
        existing.setStatus(CommentStatus.INACTIVE);
        commentRepository.save(existing);
    }

    @Override
    public List<ResponseCommentDTO> getAll() {

        return commentRepository.findAll()
                .stream()
                .filter(comment -> comment.getStatus() == CommentStatus.ACTIVE)
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseCommentDTO getOne(long id) throws Exception {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new Exception("Comment not found with id: " + id));
        ResAccountDTO accountInfo=accountClient.getAccountInfo(comment.getUserId());
        ResponseCommentDTO response= commentMapper.toCommentResponse(comment);
        response.setAvatar(accountInfo.getAvatar());
        response.setUsername(accountInfo.getUsername());

        return response;
    }

    @Override
    public List<ResponseCommentDTO> getAnswerOfComment(long replyId) {
        List<Comment> comments= commentRepository.findByReplyId(replyId);
        List<ResponseCommentDTO> responses= comments.stream().map(commentMapper :: toCommentResponse).collect(Collectors.toList());

        return responses.stream().peek(comment -> {
            try {
                ResAccountDTO accountInfo= accountClient.getAccountInfo(comment.getUserId());
                if (accountInfo !=null){
                    comment.setUsername(accountInfo.getFirstName() + " " +accountInfo.getLastName());
                    comment.setAvatar(accountInfo.getAvatar());
                }
            } catch (Exception e) {
                log.error(e.getMessage());
                return;
            }


        }).collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "commentsOfTest",key = "#testId")
    public List<ResponseCommentDTO> getCommentsOfTest(long testId) {
        List<Comment> comments=commentRepository.findByTestId(testId);
        List<ResponseCommentDTO> responses= comments.stream().map(commentMapper :: toCommentResponse).collect(Collectors.toList());

        return responses.stream().peek(response ->{
            try {
                ResAccountDTO accountDTO =accountClient.getAccountInfo(response.getUserId());
                if (accountDTO !=null){
                    response.setUsername(accountDTO.getFirstName() + " "+ accountDTO.getLastName());
                    response.setAvatar(accountDTO.getAvatar());
                }
            } catch (Exception e){
                log.error(e.getMessage());
                return ;
            }

        }).collect(Collectors.toList());
    }
}
