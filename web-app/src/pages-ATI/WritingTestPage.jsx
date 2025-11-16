import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputColumn from "../components-ATI/writing/InputColumn";
import { toast } from "react-toastify";
import { createAttempts } from "../slice/attempts";
// (1. Import thunk để fetch câu hỏi)
// Giả định bạn có thunk này từ slice 'questions'
import { retrieveQuestionForTest } from "../slice/questions";

// (2. Xóa MOCK_TEST_DATA)
// const MOCK_TEST_DATA = { ... };

function WritingTestPage() {
  const [isLoading, setIsLoading] = useState(false); // Dùng cho việc 'nộp bài'
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: testId } = useParams();

  const isLockMode = !!testId;

  // (3. Lấy state từ Redux)
  // Lấy 'pageLoading' và 'questions' từ slice (ví dụ: 'questions')
  const {
    questions,
    loading: pageLoading, // 'pageLoading' giờ do Redux quản lý
    error
  } = useSelector((state) => state.questions); // Giả định slice tên 'questions'

  const { user } = useSelector((state) => state.authentication);


  // (4. Dùng useMemo để "chuyển đổi" data)
  // Chuyển đổi response API (mảng) thành object 'lockedData'
  const lockedData = useMemo(() => {
    // Nếu không ở 'lock mode' hoặc không có câu hỏi, trả về null
    if (!isLockMode || !questions || questions.length === 0) {
      return null;
    }

    // Response API là một mảng, nhưng trang này chỉ hiển thị 1 task.
    // Lấy phần tử đầu tiên (ví dụ: Task 1)
    const task = questions[0];

    // "Chuyển đổi" trường mới (API) thành trường cũ (UI)
    return {
      id: task.id,
      taskType: task.part,       // "Task 1"
      promptText: task.title,   // "The chart shows..."
      promptImage: task.resourceContent // Link ảnh (nếu có)
    };
  }, [isLockMode, questions]);


  // (5. useEffect: Fetch dữ liệu thật)
  useEffect(() => {
    if (isLockMode) {
      // 'setPageLoading(true)' không cần nữa vì Redux lo
      console.log(`Fetching test với ID: ${testId}`);
      dispatch(retrieveQuestionForTest(testId))
        .unwrap()
        .catch((error) => {
          console.error("Không tìm thấy bài test:", error);
          toast.error("Không tìm thấy bài test!");
          // 'setLockedData(null)' không cần nữa vì useMemo sẽ xử lý
        });
    }
  }, [testId, isLockMode, dispatch]);

  // Xử lý nộp bài: Chỉ lưu và chuyển hướng
  // (Hàm này không cần thay đổi vì 'lockedData' đã được 'useMemo' chuẩn bị)
  const handleGrade = useCallback(
    async (formData) => {
      setIsLoading(true);
      toast.info("Đang nộp bài làm của bạn...");

      try {
        const taskText = isLockMode ? lockedData.promptText : formData.task;
        const essayText = formData.essay;

        if (!essayText || !taskText) {
          toast.error("Vui lòng nhập đầy đủ đề bài và bài luận.");
          setIsLoading(false);
          return;
        }

        const userId = user?.sub;
        const quizId = isLockMode ? lockedData.id : 0;
        const gradingIeltsId = "mock-writing-" + Date.now();

        const attemptData = {
          quizId: quizId,
          userId: userId,
          timeTaken: 3600,
          type: "IELTS",
          field: ["Writing"],
          gradingIeltsId: gradingIeltsId,
          answers: [
            { questionId: 0, userAnswer: essayText }
          ]
        };

        const action = await dispatch(createAttempts(attemptData));

        if (!createAttempts.fulfilled.match(action)) {
          throw new Error(action.payload || "Lỗi khi lưu bài làm!");
        }

        const newAttemptId = action.payload;

        if (!newAttemptId) {
          throw new Error("Không lấy được ID bài làm sau khi tạo.");
        }

        toast.success("Nộp bài thành công! Đang chuyển trang kết quả.");
        navigate(`/writing-result/${newAttemptId}`, {
          state: {
            task: taskText,
            essay: essayText,
            // (Thêm ảnh nếu có)
            promptImage: isLockMode ? lockedData.promptImage : null
          }
        });

      } catch (error) {
        console.error("Lỗi khi nộp bài viết:", error);
        toast.error(`Đã xảy ra lỗi: ${error.message}`);
        setIsLoading(false);
      }
    },
    // 'lockedData' giờ là dependency vì nó đến từ 'useMemo'
    [navigate, dispatch, isLockMode, lockedData, user]
  );

  // (6. renderContent giờ đã được điều khiển bởi Redux)
  const renderContent = () => {
    if (isLockMode && pageLoading) {
      return (
        <div className="text-center p-20 bg-white rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">
            Đang tải đề bài...
          </h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
        </div>
      );
    }

    // Nếu có lỗi API (error) hoặc không có 'lockedData' (sau khi load xong)
    if (isLockMode && !pageLoading && (error || !lockedData)) {
      return (
        <div className="text-center p-20 bg-red-50 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-2xl font-semibold text-red-700">Lỗi</h2>
          <p className="text-red-600 mt-2">
            {error ? error.message : `Không tìm thấy bài test với ID: ${testId}.`}
          </p>
        </div>
      );
    }

    return (
      <InputColumn
        onGrade={handleGrade}
        isLoading={isLoading}
        lockedData={lockedData}
      />
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 md:p-10 rounded-xl shadow-lg mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            AI Writing Assessment
          </h1>
          <p className="text-lg md:text-xl text-indigo-100">
            Nhập đề bài và bài làm của bạn để được chấm điểm chi tiết.
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default WritingTestPage;