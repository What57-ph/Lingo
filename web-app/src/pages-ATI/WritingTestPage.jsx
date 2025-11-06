import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputColumn from "../components-ATI/writing/InputColumn";
import { toast } from "react-toastify";
import { createAttempts } from "../slice/attempts";
// import { retrieveSingleTest } from "../slice/tests"; 

const MOCK_TEST_DATA = {
  id: 1,
  taskType: 1,
  promptText:
    "The chart below shows the changes in the percentage of the population in four European countries who bought different types of products online from 2018 to 2022.",
  promptImage: "https://i.imgur.com/gim2k9g.png",
};

function WritingTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: testId } = useParams();

  const isLockMode = !!testId;
  const [pageLoading, setPageLoading] = useState(isLockMode);
  const [lockedData, setLockedData] = useState(null);

  useEffect(() => {
    if (isLockMode) {
      setPageLoading(true);
      console.log(`(Mock) Đang fetch test với ID: ${testId}`);
      setTimeout(() => {
        setLockedData(MOCK_TEST_DATA);
        setPageLoading(false);
      }, 1000);

      /*
      dispatch(retrieveSingleTest(testId))
        .unwrap()
        .then((testData) => setLockedData(testData))
        .catch((error) => {
          console.error("Không tìm thấy bài test:", error);
          toast.error("Không tìm thấy bài test!");
          setLockedData(null);
        })
        .finally(() => setPageLoading(false));
      */
    }
  }, [testId, isLockMode, dispatch]);

  const handleGrade = useCallback(
    async (formData) => {
      setIsLoading(true);
      toast.info("Đang nộp bài làm của bạn...");

      try {
        const userId = "b3dbd68b-0613-466c-9037-ebdea8a184c1";
        const quizId = isLockMode ? lockedData.id : 2;
        const mockGradingId = "mock-writing-" + Date.now();

        const attemptData = {
          quizId: quizId,
          userId: userId,
          timeTaken: 3600,
          type: "IELTS",
          field: ["Writing"],
          gradingIeltsId: mockGradingId,
          answers: [
            { questionId: 0, userAnswer: formData.essay }
          ]
        };

        const action = await dispatch(createAttempts(attemptData));

        if (!createAttempts.fulfilled.match(action)) {
          throw new Error(action.payload || "Lỗi khi lưu bài làm!");
        }

        const newAttempt = action.payload;
        const newAttemptId = newAttempt;

        if (!newAttemptId) {
          throw new Error("Không lấy được ID bài làm sau khi tạo (payload bị rỗng).");
        }

        toast.success("Nộp bài thành công! Đang chuyển trang kết quả.");

        navigate(`/writing-result/${newAttemptId}`);

      } catch (error) {
        console.error("Lỗi khi nộp bài viết:", error);
        toast.error(`Đã xảy ra lỗi: ${error.message}`);
        setIsLoading(false);
      }
    },
    [navigate, dispatch, isLockMode, lockedData]
  );

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

    if (isLockMode && !pageLoading && !lockedData) {
      return (
        <div className="text-center p-20 bg-red-50 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-2xl font-semibold text-red-700">Lỗi</h2>
          <p className="text-red-600 mt-2">
            Không tìm thấy bài test với ID: {testId}.
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