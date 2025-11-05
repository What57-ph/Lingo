import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import WritingDisplayPanel from "../components-ATI/writing/WritingDisplayPanel";
import WritingAnalysisPanel from "../components-ATI/writing/WritingAnalysisPanel";



const MOCK_AI_RESPONSE = {
  scores: {
    overall: 7.5,
    // (Thêm các điểm thành phần nếu cần)
  },
  status: {
    level: "Giỏi",
    time: "2 phút 34 giây",
    state: "Đạt yêu cầu",
  },
  errors: [
    {
      text: "technology made our lives more complicated",
      suggestion: "technology has made our lives more complicated",
      type: "grammar",
      typeVi: "Ngữ pháp",
      location: "Đoạn 1, câu 2",
      explanation:
        "Cần sử dụng thì hiện tại hoàn thành để diễn tả tác động kéo dài đến hiện tại",
      color: "red",
    },
    {
      text: "For example",
      suggestion: "For instance",
      type: "vocabulary",
      typeVi: "Từ vựng",
      location: "Đoạn 2, câu 2",
      explanation:
        'Sử dụng "For instance" sẽ trang trọng và học thuật hơn trong bài viết IELTS',
      color: "yellow",
    },
  ],
  suggestions: {
    strongPoints: [
      "Cấu trúc bài viết rõ ràng với mở bài, thân bài và kết luận",
      "Trả lời đầy đủ cả hai quan điểm và đưa ra ý kiến cá nhân",
      "Sử dụng từ vựng phong phú và chính xác",
    ],
    grammar: [
      "Chú ý sử dụng đúng thì trong các câu phức",
      "Kiểm tra lại cấu trúc câu trước khi hoàn thành",
    ],
    vocabulary: [
      "Sử dụng từ đồng nghĩa để tránh lặp từ",
      "Học thêm các cụm từ học thuật",
    ],
    coherence: [
      "Sử dụng thêm các liên từ nối ý",
      "Đảm bảo mỗi đoạn có chủ đề rõ ràng",
    ],
  },
};

// ====================================================================
// === THÊM MỚI 2: MOCK DATA CHO FORM (ĐỂ TEST TRANG) ===
// ====================================================================
const MOCK_FORM_DATA = {
  task: 1,
  prompt:
    "The chart below shows the changes in the percentage of the population in four European countries who bought different types of products online from 2018 to 2022.",
  essay: `The chart illustrates the changes in online shopping habits across four European nations between 2018 and 2022.

Overall, there was a noticeable increase in the proportion of people engaging in e-commerce in all countries. However, the types of goods purchased varied significantly.

In 2018, the purchase of electronics was the most popular, especially in Germany (around 35%). This figure saw a steady rise to 40% by 2022. In contrast, online grocery shopping was the least common in 2018, with all four countries reporting figures below 10%. This category, however, experienced the most dramatic growth, quadrupling in France to nearly 20% by 2022.

Clothing and apparel constituted the second major category. The UK led in this segment, starting at 25% and finishing at 32%. Meanwhile, Spain showed a remarkable increase in this area, doubling its percentage from 15% to 30% over the five-year period.`,
  image: "https://i.imgur.com/gim2k9g.png", // URL ảnh biểu đồ mẫu
};

export default function WritingResultPage() {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const [promptImageUrl, setPromptImageUrl] = useState(null);

  const location = useLocation();
  // ====================================================================
  // === SỬA ĐỔI: SỬ DỤNG MOCK DATA LÀM DỰ PHÒNG ===
  // ====================================================================
  // Trang sẽ cố gắng lấy 'formData' từ 'location.state' (khi đi từ trang trước).
  // Nếu không có, nó sẽ dùng 'MOCK_FORM_DATA' để bạn test.
  const formData = location.state?.formData || MOCK_FORM_DATA;

  const wordCount = formData?.essay
    ? formData.essay.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // useEffect để xử lý URL ảnh (Giữ nguyên)
  useEffect(() => {
    let imageUrl = null;
    const imageSource = formData?.image;

    if (imageSource) {
      if (typeof imageSource === "string") {
        imageUrl = imageSource;
      } else if (imageSource instanceof File || imageSource instanceof Blob) {
        imageUrl = URL.createObjectURL(imageSource);
      }
    }
    setPromptImageUrl(imageUrl);

    return () => {
      if (
        imageUrl &&
        (imageSource instanceof File || imageSource instanceof Blob)
      ) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [formData?.image]);

  // useEffect cho Resizer (Giữ nguyên)
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
    const handleMouseUp = () => {
      setIsResizing(false);
    };
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

  // Bộ kiểm tra (Guard Clause)
  // (Sẽ không chạy nếu MOCK_FORM_DATA được sử dụng)
  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Không tìm thấy dữ liệu bài làm
        </h1>
        <p className="text-gray-600">
          Vui lòng quay lại trang nộp bài và chấm điểm trước.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* <Header /> */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden mt-2">
        {/* Component bên trái */}
        <WritingDisplayPanel
          width={leftWidth}
          task={formData.task}
          promptText={formData.prompt}
          essayText={formData.essay}
          promptImageUrl={promptImageUrl}
          wordCount={wordCount}
        />

        {/* Resizer */}
        <div
          className="w-1 bg-gray-300 hover:bg-teal-500 cursor-col-resize transition-colors relative group"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-10 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Component bên phải */}
        <WritingAnalysisPanel
          width={100 - leftWidth}
          aiData={MOCK_AI_RESPONSE} // Sử dụng mock AI
          wordCount={wordCount}
        />
      </div>
    </div>
  );
}