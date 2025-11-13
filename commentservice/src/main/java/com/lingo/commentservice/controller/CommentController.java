package com.lingo.commentservice.controller;

import com.lingo.commentservice.dto.request.RequestCommentDTO;
import com.lingo.commentservice.dto.request.RequestReplyDTO;
import com.lingo.commentservice.dto.response.ResponseCommentDTO;
import com.lingo.commentservice.service.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/comment")
public class CommentController {

    CommentService commentService;

    @PostMapping
    public ResponseEntity<ResponseCommentDTO> add(@RequestBody RequestCommentDTO dto) {
        return ResponseEntity.ok(commentService.add(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseCommentDTO> update(@PathVariable long id,
                                                     @RequestBody RequestCommentDTO dto) {
        return ResponseEntity.ok(commentService.update(dto, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseCommentDTO>> getAll() {
        return ResponseEntity.ok(commentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseCommentDTO> getOne(@PathVariable("id") long id) throws Exception {
        return ResponseEntity.ok(commentService.getOne(id));
    }

    @GetMapping("/replies/{id}")
    public ResponseEntity<List<ResponseCommentDTO>> getReplyOfComment(@PathVariable("id") long id){
        return ResponseEntity.ok(commentService.getAnswerOfComment(id));
    }
}
