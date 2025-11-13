// SingleComment.jsx
import { useState } from "react";
import { Avatar, Button, Input } from "antd";
import { DislikeFilled, LikeFilled, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addComment, retrieveRepliesOfComment } from "../../slice/commentSlice";

const SingleComment = ({ id, author, time, content, likes, dislikes, replies, testId }) => {
  const dispatch = useDispatch();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;

    dispatch(
      addComment({
        content: replyText,
        testId: testId,
        parentCommentId: id, // send parent comment id to API
      })
    ).then(() => {
      setReplyText("");
      setShowReplyInput(false);
      dispatch(retrieveRepliesOfComment(id)); // refresh replies for this comment
    });
  };

  return (
    <div className="flex space-x-3 gap-1">
      <Avatar className="!bg-red-500" icon={<UserOutlined />} />
      <div className="flex-1">
        <div className="rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">{author}</span>
            <span className="text-xs text-gray-500">{time}</span>
          </div>
          <p className="text-gray-700 text-sm mb-3">{content}</p>
          <div className="flex items-center text-xs text-gray-500 gap-2">
            <Button type="text">
              <LikeFilled /> {likes || 0}
            </Button>
            <Button type="text">
              <DislikeFilled /> {dislikes || 0}
            </Button>
            <Button
              type="text"
              onClick={() => setShowReplyInput((prev) => !prev)}
            >
              Trả lời
            </Button>
          </div>
        </div>

        {showReplyInput && (
          <div className="ml-8 mt-2">
            <Input.TextArea
              rows={2}
              placeholder="Viết phản hồi..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex justify-end mt-2 gap-2">
              <Button onClick={() => setShowReplyInput(false)}>Hủy</Button>
              <Button type="primary" onClick={handleReplySubmit}>
                Gửi
              </Button>
            </div>
          </div>
        )}

        {replies?.length > 0 && (
          <div className="ml-8 mt-2 space-y-2">
            {replies.map((reply) => (
              <SingleComment key={reply.id} {...reply} testId={testId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleComment;
