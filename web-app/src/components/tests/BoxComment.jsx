// BoxComment.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Input, Button, Select } from "antd";
import SingleComment from "./SingleComment";
import { retrieveAllComments, addComment } from "../../slice/commentSlice";

const BoxComment = ({ testId }) => {
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);

  const [newComment, setNewComment] = useState("");
  const [sort, setSort] = useState("newest");

  // Fetch comments on page load
  useEffect(() => {
    if (testId) {
      dispatch(retrieveAllComments(testId));
    }
  }, [dispatch, testId]);

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    dispatch(addComment({ content: newComment, testId })).then(() => {
      setNewComment("");
      dispatch(retrieveAllComments(testId)); // refresh after posting
    });
  };

  const handleSortChange = (value) => {
    setSort(value);
    // Optional: sort locally or refetch based on API
  };

  return (
    <Card className="!shadow-lg !pb-3 !mt-7">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Bình luận ({comments?.length || 0})
        </h2>
        <Select
          defaultValue={sort}
          style={{ width: 130 }}
          onChange={handleSortChange}
          options={[
            { value: "newest", label: "Mới nhất" },
            { value: "popular", label: "Phổ biến nhất" },
            { value: "likes", label: "Nhiều tương tác nhất" },
          ]}
        />
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <TextArea
          rows={4}
          placeholder="Chia sẻ kinh nghiệm của bạn về bài test này..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end mt-3">
          <Button type="primary" onClick={handlePostComment}>
            Đăng bình luận
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p>Đang tải bình luận...</p>
        ) : comments?.length > 0 ? (
          comments.map((comment) => (
            <SingleComment
              key={comment.id}
              {...comment}
              testId={testId} // pass testId for replies
            />
          ))
        ) : (
          <p className="text-gray-500">Chưa có bình luận nào.</p>
        )}
      </div>
    </Card>
  );
};

export default BoxComment;
