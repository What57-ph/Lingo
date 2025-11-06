import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import WritingDisplayPanel from "../components-ATI/writing/WritingDisplayPanel";
import WritingAnalysisPanel from "../components-ATI/writing/WritingAnalysisPanel";
import { retrieveAttempt } from "../slice/attempts";
// import { retrieveResult } from "../slice-ATI/speaking"; // (1. Import nếu bạn có AI)
// import { retrieveSingleTest } from "../slice/tests"; 

// --- DỮ LIỆU MOCK (Giữ nguyên) ---
const MOCK_AI_RESPONSE = {
  scores: { overall: 7.5 },
  status: { level: "Giỏi", time: "2 phút 34 giây", state: "Đạt yêu cầu" },
  errors: [
    { text: "technology made our lives more complicated", suggestion: "technology has made our lives more complicated", type: "grammar", typeVi: "Ngữ pháp", location: "Đoạn 1, câu 2", explanation: "...", color: "red" },
    { text: "For example", suggestion: "For instance", type: "vocabulary", typeVi: "Từ vựng", location: "Đoạn 2, câu 2", explanation: "...", color: "yellow" },
  ],
  suggestions: {
    strongPoints: ["Cấu trúc bài viết rõ ràng...", "Trả lời đầy đủ..."],
    grammar: ["Chú ý sử dụng đúng thì...", "Kiểm tra lại cấu trúc..."],
    vocabulary: ["Sử dụng từ đồng nghĩa...", "Học thêm các cụm từ..."],
    coherence: ["Sử dụng thêm các liên từ...", "Đảm bảo mỗi đoạn..."],
  },
};
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

  const { id: attemptId } = useParams();
  const dispatch = useDispatch();

  const {
    attempt,
    loading: attemptLoading,
    error: attemptError
  } = useSelector((state) => state.attempts);

  // const { 
  //   result: assessmentResult, 
  //   loading: assessmentLoading, 
  //   error: assessmentError 
  // } = useSelector((state) => state.speaking);

  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(true);


  useEffect(() => {
    if (attemptId) {
      dispatch(retrieveAttempt(attemptId));
    }
  }, [attemptId, dispatch]);

  // useEffect 2: Fetch đề bài (quiz) KHI 'attempt' đã tải xong
  useEffect(() => {
    const quizId = attempt?.quizId;
    // Chỉ chạy nếu có quizId VÀ (chưa có quizData HOẶC quizData không khớp)
    if (quizId && (quizData?.id !== quizId)) {
      setQuizLoading(true);
      console.log(`(Mock) Đang fetch Đề Bài (Quiz) với ID: ${quizId}`);
      setTimeout(() => {
        setQuizData(MOCK_TEST_DATA);
        setQuizLoading(false);
      }, 500);

      /*
      dispatch(retrieveSingleTest(quizId))
        .unwrap()
        .then((data) => setQuizData(data))
        .catch((err) => setQuizData(null))
        .finally(() => setQuizLoading(false));
      */
    }
  }, [attempt, dispatch]); // Phụ thuộc vào 'attempt'

  /*
  useEffect(() => {
    const gradingId = attempt?.gradingIeltsId;
    if (gradingId) {
      // (Thêm logic kiểm tra 'assessmentResult' nếu cần)
      dispatch(retrieveResult(gradingId));
    }
  }, [attempt, dispatch]);
  */

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

  const isLoading = attemptLoading || quizLoading;
  const combinedError = attemptError;

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full bg-white text-black font-sans items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full mx-auto p-10 bg-white rounded-xl">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Đang tải kết quả bài làm...
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            LexiBot đang phân tích bài viết của bạn. Vui lòng chờ...
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

  if (combinedError || !attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-700 mb-4">
          Lỗi Tải Bài Làm
        </h1>
        <p className="text-gray-600">
          {attemptError ? attemptError.message : "Không tìm thấy bài làm với ID này."}
        </p>
        <Link to="/" className="text-blue-600 mt-4">Quay về trang chủ</Link>
      </div>
    );
  }

  const task = quizData?.taskType;
  const promptText = quizData?.promptText;
  const essayText = attempt.answers[0]?.userAnswer;
  const wordCount = essayText
    ? essayText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const aiResult = MOCK_AI_RESPONSE;

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
          aiData={aiResult}
          wordCount={wordCount}
        />
      </div>
    </div>
  );
}