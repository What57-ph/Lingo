package com.lingo.commentservice.mapper;

import com.lingo.commentservice.dto.request.RequestCommentDTO;
import com.lingo.commentservice.dto.response.ResponseCommentDTO;
import com.lingo.commentservice.model.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(target = "userId",source = "userId")
    Comment toComment(RequestCommentDTO request);

    @Mapping(target = "updatedAt", source = "updatedAt")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "replies", source = "replies")
    ResponseCommentDTO toCommentResponse(Comment comment);
}
