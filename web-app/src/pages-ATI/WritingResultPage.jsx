import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import WritingDisplayPanel from "../components-ATI/writing/WritingDisplayPanel";
import WritingAnalysisPanel from "../components-ATI/writing/WritingAnalysisPanel";
import { retrieveAttempt } from "../slice/attempts";
import { createSubmit, resetWritingResult } from "../slice-ATI/writing";

const MOCK_TEST_DATA = {
  id: 1,
  taskType: 1,
  promptText:
    "The chart below shows the changes in the percentage of the population in four European countries who bought different types of products online from 2018 to 2022.",
  promptImage: "https://i.imgur.com/gim2k9g.png",
};

export default function WritingResultPage() {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const [promptImageUrl, setPromptImageUrl] = useState(null);
  const [isAiCallInitiated, setIsAiCallInitiated] = useState(false);

  const { id: attemptId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  // ✅ LẤY task VÀ essay TỪ LOCATION STATE
  const taskFromState = location.state?.task;
  const essayFromState = location.state?.essay;

  const {
    attempt,
    loading: attemptLoading,
    error: attemptError
  } = useSelector((state) => state.attempts);

  const {
    result: assessmentResult,
    loading: assessmentLoading,
    error: assessmentError
  } = useSelector((state) => state.writing);

  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(true);

  // Reset state khi vào trang mới
  useEffect(() => {
    dispatch(resetWritingResult());
    setIsAiCallInitiated(false);
  }, [attemptId, dispatch]);

  // Fetch attempt
  useEffect(() => {
    if (attemptId) {
      dispatch(retrieveAttempt(attemptId));
    }
  }, [attemptId, dispatch]);

  // Fetch quiz data (chỉ để hiển thị ảnh nếu có)
  useEffect(() => {
    const quizId = attempt?.quizId;

    if (!attemptLoading && attempt) {
      if (quizId && quizId > 0 && (quizData?.id !== quizId)) {
        setQuizLoading(true);
        setTimeout(() => {
          setQuizData(MOCK_TEST_DATA);
          setQuizLoading(false);
        }, 500);
      } else {
        setQuizLoading(false);
      }
    }
  }, [attempt, attemptLoading, quizData?.id]);

  // ✅ GỌI AI NGAY KHI CÓ task VÀ essay (TỪ STATE)
  useEffect(() => {
    if (
      taskFromState &&
      essayFromState &&
      !assessmentResult &&
      !assessmentLoading &&
      !isAiCallInitiated
    ) {
      console.log("📤 Gửi bài cho AI chấm điểm...");
      console.log("Task:", taskFromState);
      console.log("Essay:", essayFromState.substring(0, 100) + "...");

      setIsAiCallInitiated(true);

      const aiFormData = {
        task: taskFromState,
        essay: essayFromState,
      };

      dispatch(createSubmit(aiFormData))
        .unwrap()
        .then((result) => {
          console.log("✅ Nhận được kết quả AI:", result);
        })
        .catch((error) => {
          console.error("❌ Lỗi khi gọi AI:", error);
        });
    }
  }, [taskFromState, essayFromState, assessmentResult, assessmentLoading, isAiCallInitiated, dispatch]);

  // Handle image URL
  useEffect(() => {
    let imageUrl = null;
    const imageSource = quizData?.promptImage;
    if (imageSource) {
      if (typeof imageSource === "string") {
        imageUrl = imageSource;
      } else if (imageSource instanceof File || imageSource instanceof Blob) {
        imageUrl = URL.createObjectURL(imageSource);
      }
    }
    setPromptImageUrl(imageUrl);
    return () => {
      if (imageUrl && (imageSource instanceof File || imageSource instanceof Blob)) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [quizData?.promptImage]);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const isLoading = attemptLoading || quizLoading || assessmentLoading;
  const combinedError = attemptError || assessmentError;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full bg-white text-black font-sans items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full mx-auto p-10 bg-white rounded-xl">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Đang tải kết quả bài làm...
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {assessmentLoading
              ? "LexiBot đang phân tích bài viết của bạn. Việc này có thể mất một chút thời gian..."
              : "Đang tải dữ liệu bài làm..."}
          </p>
          <div className="flex justify-center items-center space-x-2">
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (combinedError || !attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-700 mb-4">
          Lỗi Tải Dữ Liệu
        </h1>
        <p className="text-gray-600">
          {combinedError ? combinedError.message : "Không tìm thấy bài làm với ID này."}
        </p>
        <Link to="/" className="text-blue-600 mt-4">Quay về trang chủ</Link>
      </div>
    );
  }

  // ✅ LẤY DỮ LIỆU ĐỂ HIỂN THỊ
  const task = quizData?.taskType || 1;
  const promptText = taskFromState || quizData?.promptText || "Không có đề bài";
  const essayText = essayFromState || attempt.answers[0]?.userAnswer || "";
  const wordCount = essayText
    ? essayText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div ref={containerRef} className="flex flex-1 overflow-hidden mt-2">
        <WritingDisplayPanel
          width={leftWidth}
          task={task}
          promptText={promptText}
          essayText={essayText}
          promptImageUrl={promptImageUrl}
          wordCount={wordCount}
        />

        <div
          className="w-1 bg-gray-300 hover:bg-teal-500 cursor-col-resize transition-colors relative group"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-10 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <WritingAnalysisPanel
          width={100 - leftWidth}
          aiData={assessmentResult}
          wordCount={wordCount}
        />
      </div>
    </div>
  );
}