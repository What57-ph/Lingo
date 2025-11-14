import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Input, Button, Select } from "antd";
import SingleComment from "./SingleComment";
import { retrieveCommentsOfTest, addComment } from "../../slice/commentSlice";
import { retrieveAccountByUsername } from "../../slice/accounts";

const BoxComment = ({ testId }) => {
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const { commentOfTest, loading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.authentication);
  const { currentUser } = useSelector((state) => state.accounts)
  const [newComment, setNewComment] = useState("");
  const [sort, setSort] = useState("newest");
  const [currentCommentMode, setCurrentCommentMode] = useState("COMMENT");
  useEffect(() => {
    if (testId) {
      dispatch(retrieveCommentsOfTest(testId));
    }
  }, [dispatch, testId]);

  useEffect(() => {
    dispatch(retrieveAccountByUsername(user?.preferred_username))
  }, [])
  const handlePostComment = () => {
    if (!newComment.trim()) return;
    dispatch(
      addComment({
        content: newComment,
        testId,
        type: "COMMENT",
        userId: currentUser?.id || null,
      })
    ).then(() => {
      setCurrentCommentMode("COMMENT")
      setNewComment("");
      dispatch(retrieveCommentsOfTest(testId));
    });
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  console.log("current user", user)
  console.log("comment of test", commentOfTest)
  console.log("needed comments", commentOfTest.filter((comment) => comment.type === "COMMENT"))
  return (
    <Card className="!shadow-lg !pb-3 !mt-7">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Bình luận ({commentOfTest?.length || 0})
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
        ) : commentOfTest?.length > 0 ? (
          commentOfTest.filter((comment) => comment.type === "COMMENT").map((comment) => (
            <SingleComment
              key={comment.id}
              comment={comment}
              testId={testId}
              currentCommentMode={currentCommentMode}
              setCurrentCommentMode={currentCommentMode}
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