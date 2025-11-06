import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FinishedScreen } from "../components-ATI/speaking/FinishedScreen";
import SpeakingHeader from "../components-ATI/speaking/SpeakingHeader";
import SpeakingFooter from "../components-ATI/speaking/SpeakingFooter";
import { SPEAKING_QUESTIONS as DEFAULT_QUESTIONS } from "../data/MockData";
import { useDispatch } from "react-redux";
import { saveSingleFile } from "../slice/files";
import { createSubmit } from "../slice-ATI/speaking";
import { createAttempts } from "../slice/attempts";
import { toast } from "react-toastify";

const MOCK_LOCKED_TEST = {
  quizId: 101, // ID của bài test
  topicPrompt: "Mock Test: Technology",
  questions: [
    { type: "Part 1", text: "Do you use any gadgets on a daily basis?" },
    { type: "Part 2", text: "Describe a piece of technology you find useful." },
    { type: "Part 3", text: "Do you think technology makes our lives simpler or more complicated?" },
  ],
};

const FREE_PRACTICE_TEST = {
  quizId: 2,
  topicPrompt: "IELTS Speaking Free Practice",
  questions: DEFAULT_QUESTIONS,
};

function SpeakingTestPage() {
  const { testId } = useParams();
  const isLockMode = !!testId;

  const [testData, setTestData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState("idle");
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [finalRecording, setFinalRecording] = useState({ audioUrl: null, blob: null });
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaRecorderRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setPageLoading(true);
    if (isLockMode) {
      console.log(`(Mock) Đang fetch test với ID: ${testId}`);

      setTimeout(() => {
        setTestData(MOCK_LOCKED_TEST);
        setPageLoading(false);
      }, 1000);

      /*
      dispatch(retrieveSingleTest(testId))
        .unwrap()
        .then((data) => {
          setTestData({
            quizId: data.id,
            topicPrompt: data.title,
            questions: data.questions,
          });
        })
        .catch((err) => {
          toast.error("Không tìm thấy bài test!");
          setTestData(null);
        })
        .finally(() => setPageLoading(false));
      */
    } else {
      setTestData(FREE_PRACTICE_TEST);
      setPageLoading(false);
    }
  }, [testId, isLockMode, dispatch]);

  useEffect(() => {
    if (recordingStatus === "recording") {
      timerIntervalRef.current = setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [recordingStatus]);

  useEffect(() => {
    return () => {
      stopMediaStream();
      clearInterval(timerIntervalRef.current);
    };
  }, []);


  const stopMediaStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startRecording = async () => {
    if (recordingStatus === "paused" && mediaRecorderRef.current) {
      mediaRecorderRef.current.resume();
      setRecordingStatus("recording");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recordedChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.start();
      setRecordingStatus("recording");
    } catch (err) {
      console.error("Lỗi khi truy cập micro:", err);
      toast.error("Không thể truy cập micro. Vui lòng cấp quyền.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === "recording") {
      mediaRecorderRef.current.pause();
      setRecordingStatus("paused");
    }
  };

  // --- Hàm Điều khiển ---

  const handleToggleRecordPause = () => {
    if (isFinished) return;
    if (recordingStatus === "recording") {
      pauseRecording();
    } else {
      startRecording();
    }
  };

  // Các hàm này sẽ được gán lại giá trị sau khi testData được tải
  let handleNextQuestion = () => { };

  const handleFinishTest = () => {
    if (isFinished) return;
    clearInterval(timerIntervalRef.current);
    if (recordingStatus === "idle" && recordedChunksRef.current.length === 0) {
      setFinalRecording({ audioUrl: null, blob: null });
      setIsFinished(true);
      stopMediaStream();
      return;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(blob);
        setFinalRecording({ audioUrl, blob });
        recordedChunksRef.current = [];
        setIsFinished(true);
        stopMediaStream();
        setRecordingStatus("idle");
      };
      if (recordingStatus !== "idle") {
        mediaRecorderRef.current.stop();
      }
    } else {
      setIsFinished(true);
    }
  };

  const handleClose = () => {
    if (!isFinished && recordingStatus !== "idle") {
      if (!window.confirm("Bạn có chắc muốn thoát? Toàn bộ tiến trình sẽ bị mất.")) {
        return;
      }
    }
    stopMediaStream();
    navigate("/");
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSubmitForGrading = async () => {
    const userId = "b3dbd68b-0613-466c-9037-ebdea8a184c1";
    const { quizId, topicPrompt } = testData;

    if (!finalRecording.blob) {
      toast.warn("Không tìm thấy file ghi âm.");
      return;
    }
    setIsSubmitting(true);
    toast.info("Đang nộp bài, vui lòng chờ...");

    try {
      const uploadAction = await dispatch(
        saveSingleFile({
          file: finalRecording.blob,
          testTitle: topicPrompt,
          fileCategory: "SPEAKING",
        })
      );
      if (!saveSingleFile.fulfilled.match(uploadAction)) {
        throw new Error(uploadAction.payload || "Lỗi khi tải file lên Cloud.");
      }
      const audioUrl = uploadAction.payload?.mediaUrl;
      console.log("File đã tải lên Cloud:", audioUrl);

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("topic_prompt", topicPrompt);
      formData.append("audio", finalRecording.blob, "speaking_test.webm");

      const submitAction = await dispatch(createSubmit(formData));
      if (!createSubmit.fulfilled.match(submitAction)) {
        throw new Error(submitAction.payload || "Lỗi khi nộp bài cho AI!");
      }
      const gradingId = submitAction.payload?.submission_id;
      console.log("Đã nộp cho AI, gradingId:", gradingId);

      const attemptData = {
        quizId: quizId,
        userId: userId,
        timeTaken: totalElapsedTime,
        type: "IELTS",
        field: ["Speaking"],
        gradingIeltsId: gradingId, // ID từ AI
        answers: [
          { questionId: 0, userAnswer: audioUrl }
        ]
      };

      const createAttemptAction = await dispatch(createAttempts(attemptData));
      if (!createAttempts.fulfilled.match(createAttemptAction)) {
        throw new Error(createAttemptAction.payload || "Lỗi khi lưu bài làm!");
      }

      const newAttempt = createAttemptAction.payload;
      const newAttemptId = newAttempt;

      if (!newAttemptId) {
        console.error("Payload của createAttempts không có ID:", newAttempt);
        throw new Error("Không lấy được ID bài làm sau khi tạo.");
      }

      console.log("Đã tạo attempt thành công, ID:", newAttemptId);
      toast.success("Nộp bài thành công! Đang chuyển trang kết quả.");

      // --- BƯỚC 4: Điều hướng bằng URL ĐỘNG ---
      navigate(`/speaking-result/${newAttemptId}`);

    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
      setIsSubmitting(false); // Chỉ dừng loading nếu lỗi
    }
  };


  if (pageLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-2xl font-semibold">Đang tải bài thi...</h1>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-semibold text-red-600">Lỗi</h1>
          <p className="mt-2">Không tìm thấy bài thi với ID: {testId}.</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const TOTAL_QUESTIONS = testData.questions.length;
  const currentQuestion = testData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;

  handleNextQuestion = () => {
    const isLast = currentQuestionIndex === TOTAL_QUESTIONS - 1;
    if (isLast) {
      handleFinishTest();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-black font-sans">
      <SpeakingHeader {...{ isFinished, TOTAL_QUESTIONS, currentQuestionIndex, totalElapsedTime, formatTime, handleClose }} />

      <main className="flex-1 flex items-center justify-center p-8">
        {!isFinished ? (
          <div className="text-center">
            <span className="text-sm font-semibold text-blue-600 uppercase">
              {currentQuestion.type}
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mt-4 whitespace-pre-line max-w-3xl">
              {currentQuestion.text}
            </h1>
          </div>
        ) : (
          <FinishedScreen
            recording={finalRecording}
            onSubmit={handleSubmitForGrading}
            isSubmitting={isSubmitting}
          />
        )}
      </main>

      <SpeakingFooter {...{ handleToggleRecordPause, isFinished, recordingStatus, handleNextQuestion, isLastQuestion }} />
    </div>
  );
}

export default SpeakingTestPage;