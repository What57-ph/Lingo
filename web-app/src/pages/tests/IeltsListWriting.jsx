import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { retrieveAllTests } from "../../slice/tests";
import {
  ClockCircleOutlined,
  EyeOutlined,
  MessageOutlined,
} from "@ant-design/icons";

// --- Icon Components (SVG nhúng trực tiếp) ---
const LightningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

// --- Component Card Đề thi ---
const TestCard = ({ test, onTakeTest }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-5 flex flex-col h-full space-y-4 transition-shadow hover:shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 min-h-[2.8rem] line-clamp-2">
        {test.title.replaceAll("_", " ")}
      </h3>
      <div className="flex items-center text-gray-500 text-sm space-x-4 border-b border-gray-100 pb-4">
        <span className="flex items-center gap-1.5" title="Thời gian">
          <ClockCircleOutlined />
          {test.timeLimit} phút
        </span>
        <span className="flex items-center gap-1.5" title="Số câu hỏi">
          <EyeOutlined />
          {test.numOfQuestions} câu
        </span>
      </div>
      <div className="text-sm text-gray-700">
        {test.numOfQuestions} câu hỏi • {test.timeLimit} phút
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
          #{test.type}
        </span>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
          #Writing
        </span>
      </div>
      <div className="flex-grow"></div>
      <button
        onClick={() => onTakeTest(test)}
        className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2 px-4 rounded-lg border border-blue-600 transition duration-200 cursor-pointer flex items-center justify-center gap-2"
      >
        <LightningIcon />
        Take Test
      </button>
    </div>
  );
};

// --- Component Pagination ---
const Pagination = ({
  testsPerPage,
  totalTests,
  setCurrentPage,
  currentPage,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalTests / testsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-md transition-colors ${currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-blue-100"
          } border border-gray-300`}
      >
        Prev
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          className={`px-4 py-2 rounded-md transition-colors border ${currentPage === number
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-blue-100 border-gray-300"
            }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-md transition-colors ${currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-blue-100"
          } border border-gray-300`}
      >
        Next
      </button>
    </nav>
  );
};

// --- Component chính của trang ---
function IeltsListWriting() {
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(12);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tests, loading, error } = useSelector((state) => state.test);

  useEffect(() => {
    // Gọi API lấy tests
    dispatch(retrieveAllTests());
  }, [dispatch]);

  const allTests = tests?.result || [];

  // Filter tests by WRITING category
  const writingTests = allTests.filter((test) => test.category === "WRITING");

  // Logic phân trang
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = writingTests.slice(indexOfFirstTest, indexOfLastTest);

  // Hàm xử lý khi nhấn Take Test
  const handleTakeTest = (testData) => {
    if (!testData) {
      console.warn("Test data không hợp lệ.");
      return;
    }
    // Navigate to writing test page or AI assessment
    navigate(`/writing-test/${testData.id}`, { state: { test: testData } });
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">Có lỗi xảy ra: {error}</p>
            </div>
          )}

          {/* No data state */}
          {!loading && !error && writingTests.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">Chưa có đề thi nào</p>
            </div>
          )}

          {/* Display tests */}
          {!loading && !error && currentTests.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentTests.map((test) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    onTakeTest={handleTakeTest}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Pagination */}
        {!loading && !error && writingTests.length > 0 && (
          <Pagination
            testsPerPage={testsPerPage}
            totalTests={writingTests.length}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        )}
      </div>
    </div>
  );
}

export default IeltsListWriting;