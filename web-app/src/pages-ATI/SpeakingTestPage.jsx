import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FinishedScreen } from "../components-ATI/speaking/FinishedScreen";
import SpeakingHeader from "../components-ATI/speaking/SpeakingHeader";
import SpeakingFooter from "../components-ATI/speaking/SpeakingFooter";
import { SPEAKING_QUESTIONS } from "../data/MockData";
import { useDispatch, useSelector } from "react-redux";
import { saveSingleFile } from "../slice/files";
import { createSubmit } from "../slice-ATI/speaking";
import { toast } from "react-toastify";


const TOTAL_QUESTIONS = SPEAKING_QUESTIONS.length;

// --- Component Chính ---
function SpeakingTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState("idle"); // idle, recording, paused
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  const [finalRecording, setFinalRecording] = useState({
    audioUrl: null,
    blob: null,
  });

  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaRecorderRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Logic Hẹn giờ ---
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

  // --- Logic Dọn dẹp ---
  useEffect(() => {
    return () => {
      stopMediaStream();
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  // --- Hàm Chức năng Ghi âm ---

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
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

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
      alert(
        "Không thể truy cập micro. Vui lòng cấp quyền micro cho trang web."
      );
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

  const handleNextQuestion = () => {
    const isLast = currentQuestionIndex === TOTAL_QUESTIONS - 1;

    if (isLast) {
      handleFinishTest();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

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
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
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
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };


  const currentQuestion = SPEAKING_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;

  const handleSubmitForGrading = async () => {

    const userId = "b3dbd68b-0613-466c-9037-ebdea8a184c1";
    const topicPrompt = "IELTS Speaking Mock Test";
    const quizId = 2;

    if (!finalRecording.blob) {
      alert("Không tìm thấy file ghi âm.");
      return;
    }

    setIsSubmitting(true);

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
      formData.append("audio", finalRecording.blob, "speaking_test.webm");
      formData.append("topic_prompt", topicPrompt);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const submitAction = await dispatch(createSubmit(formData));

      if (!createSubmit.fulfilled.match(submitAction)) {
        toast.error(createSubmit.payload || "Lỗi khi nộp bài!")
      }

      const gradingId = submitAction.payload?.submission_id;
      console.log("Đã nộp cho AI, gradingId:", gradingId);

      // navigate("/speaking-result", {
      //   state: {
      //     recording: finalRecording,
      //     gradingId: gradingId,
      //     audioUrl: audioUrl,
      //     attemptPayload: {
      //       quizId: quizId,
      //       userId: userId,
      //       timeTaken: totalElapsedTime,
      //       type: "IELTS",
      //       field: ["Speaking"],
      //     },
      //   },
      // });

    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      alert(`Đã xảy ra lỗi: ${error.message}`);
      setIsSubmitting(false);
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