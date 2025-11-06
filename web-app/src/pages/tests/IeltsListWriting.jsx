import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined,
} from "@ant-design/icons";

// --- DỮ LIỆU ĐÃ CẬP NHẬT (16 BÀI CHIA THÀNH 2 SECTION) ---
const testSectionsData = [
  {
    tests: [
      {
        id: "c15_t1",
        title: "BC IELTS writing test 1",
        taskType: 1,
        promptText: "The chart below shows...",
        promptImage: "https://i.imgur.com/v11mG9k.png", // Link ảnh mới
        duration: "60 phút",
        views: 6420,
        comments: 34,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c15_t2",
        title: "BC IELTS writing test 2",
        taskType: 2,
        promptText: "Some people say that advertising...",
        promptImage: null,
        duration: "60 phút",
        views: 2589,
        comments: 12,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c15_t3",
        title: "BC IELTS writing test 3",
        taskType: 1,
        promptText: "Some other task 1 prompt.",
        promptImage: "https://i.imgur.com/v11mG9k.png",
        duration: "60 phút",
        views: 2352,
        comments: 12,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c15_t4",
        title: "BC IELTS writing test 4",
        taskType: 2,
        promptText: "Some other task 2 prompt.",
        promptImage: null,
        duration: "60 phút",
        views: 2289,
        comments: 3,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c14_t1",
        title: "BC IELTS writing test 5",
        taskType: 1,
        promptText: "C14 Task 1 prompt.",
        promptImage: "https://i.imgur.com/v11mG9k.png",
        duration: "60 phút",
        views: 1338,
        comments: 1,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c14_t2",
        title: "BC IELTS writing test 6",
        taskType: 2,
        promptText: "C14 Task 2 prompt.",
        promptImage: null,
        duration: "60 phút",
        views: 1284,
        comments: 1,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c14_t3",
        title: "BC IELTS writing test 7",
        taskType: 1,
        promptText: "C14 Task 3 prompt.",
        promptImage: "https://i.imgur.com/v11mG9k.png",
        duration: "60 phút",
        views: 1167,
        comments: 2,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c14_t4",
        title: "BC IELTS writing test 8",
        taskType: 2,
        promptText: "C14 Task 4 prompt.",
        promptImage: null,
        duration: "60 phút",
        views: 1245,
        comments: 3,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
    ],
  },
  {
    tests: [
      {
        id: "c16_t1",
        title: "BC IELTS writing test 9",
        taskType: 1,
        promptText: "Prompt for test 9",
        promptImage: "https://i.imgur.com/v11mG9k.png",
        duration: "60 phút",
        views: 1500,
        comments: 10,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c16_t2",
        title: "BC IELTS writing test 10",
        taskType: 2,
        promptText: "Prompt for test 10",
        promptImage: null,
        duration: "60 phút",
        views: 1450,
        comments: 8,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c16_t3",
        title: "BC IELTS writing test 11",
        taskType: 1,
        promptText: "Prompt for test 11",
        promptImage: "https://i.imgur.com/v11mG9k.png",
        duration: "60 phút",
        views: 1300,
        comments: 7,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c16_t4",
        title: "BC IELTS writing test 12",
        taskType: 2,
        promptText: "Prompt for test 12",
        promptImage: null,
        duration: "60 phút",
        views: 1200,
        comments: 5,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c17_t1",
        title: "BC IELTS writing test 13",
        taskType: 1,
        promptText: "Prompt for test 13",
        promptImage: "https://i.imgur.com/v11mG9k.png",
        duration: "60 phút",
        views: 1100,
        comments: 15,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c17_t2",
        title: "BC IELTS writing test 14",
        taskType: 2,
        promptText: "Prompt for test 14",
        promptImage: null,
        duration: "60 phút",
        views: 1050,
        comments: 9,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c17_t3",
        title: "BC IELTS writing test 15",
        taskType: 1,
        promptText: "Prompt for test 15",
        promptImage: "https://i.imgur.com/v11mG9k.png",
        duration: "60 phút",
        views: 900,
        comments: 11,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
      {
        id: "c17_t4",
        title: "BC IELTS writing test 16",
        taskType: 2,
        promptText: "Prompt for test 16",
        promptImage: null,
        duration: "60 phút",
        views: 850,
        comments: 6,
        description: "2 phần thi | 2 câu hỏi",
        tags: ["IELTS Academic", "Writing"],
      },
    ],
  },
];

// --- Component Card Đề thi (ĐÃ THÊM 'cursor-pointer') ---
const TestCard = ({ test, onTakeTest }) => {
  const hasData = !!test.taskType;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col h-full space-y-4 transition-shadow hover:shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 min-h-[2.8rem] line-clamp-2">
        {test.title}
      </h3>
      <div className="flex items-center text-gray-500 text-sm space-x-4 border-b border-gray-100 pb-4">
        <span className="flex items-center gap-1.5" title="Thời gian">
          <ClockCircleOutlined />
          {test.duration}
        </span>
        <span className="flex items-center gap-1.5" title="Lượt xem">
          <EyeOutlined />
          {test.views}
        </span>
        <span className="flex items-center gap-1.5" title="Bình luận">
          <MessageOutlined />
          {test.comments}
        </span>
      </div>
      <div className="text-sm text-gray-700">{test.description}</div>
      <div className="flex flex-wrap gap-2">
        {test.tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex-grow"></div>
      <button
        onClick={() => onTakeTest(test)}
        className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2 px-4 rounded-lg border border-blue-600 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:bg-gray-50"
        disabled={!hasData}
        title={
          !hasData ? "Đề bài này chưa có dữ liệu" : "Bắt đầu làm bài thi này"
        }
      >
        Take Test
      </button>
    </div>
  );
};

// --- SỬA LỖI 1: Component Nhóm Đề thi (Thêm lại 'title') ---
const TestSection = ({ title, tests, onTakeTest }) => {
  // 'title' đã được thêm lại ở đây
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Thêm lại H2 hiển thị tiêu đề */}
      <h2 className="text-xl font-semibold text-gray-900 mb-5">{title}</h2>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} onTakeTest={onTakeTest} />
          ))}
        </div>
      </div>
    </section>
  );
};

// --- SỬA LỖI 2: Component Pagination (Code đầy đủ) ---
const Pagination = ({
  currentPage,
  setCurrentPage,
  totalSections,
  sectionsPerPage,
}) => {
  const totalPages = Math.ceil(totalSections / sectionsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const baseBtnClass =
    "w-10 h-10 sm:w-auto sm:px-4 sm:py-2 rounded-lg border font-semibold transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300";
  const activeBtnClass = "bg-blue-600 border-blue-600 text-white";
  const defaultBtnClass =
    "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
  const disabledBtnClass =
    "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed";

  return (
    <nav className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`${baseBtnClass} ${currentPage === 1 ? disabledBtnClass : defaultBtnClass
          }`}
      >
        Prev
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          className={`${baseBtnClass} ${currentPage === number ? activeBtnClass : defaultBtnClass
            }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`${baseBtnClass} ${currentPage === totalPages ? disabledBtnClass : defaultBtnClass
          }`}
      >
        Next
      </button>
    </nav>
  );
};

// --- Component chính của trang ---
function IeltsListWriting() {
  const [currentPage, setCurrentPage] = useState(1);
  // --- THAY ĐỔI: Đặt 'sectionsPerPage' = 1 ---
  // Để mỗi trang chỉ hiển thị 1 section (tức 8 bài)
  const [sectionsPerPage] = useState(1);
  const navigate = useNavigate();

  // Logic tính toán các section (Giữ nguyên)
  const indexOfLastSection = currentPage * sectionsPerPage;
  const indexOfFirstSection = indexOfLastSection - sectionsPerPage;
  const currentSections = testSectionsData.slice(
    indexOfFirstSection,
    indexOfLastSection
  );

  // Hàm xử lý khi nhấn Take Test (Giữ nguyên)
  const handleTakeTest = (testData) => {
    if (!testData || !testData.taskType) {
      console.warn("Test data không hợp lệ hoặc không có taskType.");
      return;
    }
    navigate("/ai-assessment", { state: { lockedPrompt: testData } });
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header (Giữ nguyên) */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Thư viện đề&nbsp;
            <span className="inline-block border-b-4 border-blue-500 pb-1">
              IELTS Writing
            </span>
            &nbsp;Academic
          </h1>
          <p className="text-gray-600 mt-2">
            Kho đề IELTS Writing Academic từ Cambridge và bộ đề thi thật (Actual
            Tests).
          </p>
        </header>

        <main>
          {/* 'section.title' sẽ được truyền vào 'TestSection' */}
          {currentSections.map((section) => (
            <TestSection
              key={section.title}
              title={section.title}
              tests={section.tests}
              onTakeTest={handleTakeTest}
            />
          ))}
        </main>

        {/* Pagination (Đã sửa) */}
        <Pagination
          sectionsPerPage={sectionsPerPage}
          totalSections={testSectionsData.length}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

export default IeltsListWriting;
