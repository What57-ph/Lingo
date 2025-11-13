import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { retrieveAllTests } from "../../slice/tests";

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

// --- Component Card Đề thi (Theme: Teal) ---
const TestCard = ({ test }) => {
  // Tính toán progress dựa trên attempts (có thể điều chỉnh logic này)
  const progress = test.attempts > 0 ? Math.min((test.attempts / 5) * 100, 100) : 0;

  return (
    <div className="bg-white border border-teal-300 rounded-lg shadow-sm p-4 flex flex-col items-center text-center h-full">
      <div className="bg-teal-600 text-white rounded-md w-8 h-8 flex items-center justify-center font-bold text-lg mb-2">
        {test.type === 'IELTS' ? 'I' : 'T'}
      </div>
      <h3 className="text-sm font-semibold text-gray-700 min-h-[2.8rem] flex items-center">
        {test.title.replaceAll("_", " ")}
      </h3>
      <div className="text-xs text-gray-500 mb-1">
        {test.numOfQuestions} questions • {test.timeLimit} mins
      </div>
      <div className="text-2xl font-bold text-teal-600 my-2">
        {Math.round(progress)}%
      </div>
      <Link
        to={`/tests/${test.id}/${test.title}/doTests`}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200"
      >
        <LightningIcon />
        Take Test
      </Link>
    </div>
  );
};

// --- Component Pagination (Theme: Teal) ---
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
          : "bg-white text-gray-700 hover:bg-teal-100"
          } border border-gray-300`}
      >
        Prev
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          className={`px-4 py-2 rounded-md transition-colors border ${currentPage === number
            ? "bg-teal-600 text-white border-teal-600"
            : "bg-white text-gray-700 hover:bg-teal-100 border-gray-300"
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
          : "bg-white text-gray-700 hover:bg-teal-100"
          } border border-gray-300`}
      >
        Next
      </button>
    </nav>
  );
};

// --- Component chính của trang ---
function IeltsListReading() {
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage] = useState(12);
  const dispatch = useDispatch();
  const { tests, loading, error } = useSelector((state) => state.test);

  useEffect(() => {
    // Gọi API lấy tests với filter category READING
    dispatch(retrieveAllTests());
  }, [dispatch]);

  const allTests = tests?.result || [];

  // Filter tests by READING category
  const readingTests = allTests.filter(test => test.category === 'READING');

  // Logic phân trang
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = readingTests.slice(indexOfFirstTest, indexOfLastTest);

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Thư viện đề&nbsp;
            <span className="inline-block border-b-4 border-teal-400 pb-1">
              IELTS Reading
            </span>
            &nbsp;Academic
          </h1>
          <p className="text-gray-600 mt-2">
            Kho đề IELTS Reading Academic từ Cambridge và bộ đề thi thật (Actual Tests).
          </p>
        </header>

        <main>
          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
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
          {!loading && !error && readingTests.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">Chưa có đề thi nào</p>
            </div>
          )}

          {/* Display tests */}
          {!loading && !error && currentTests.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentTests.map((test) => (
                  <TestCard key={test.id} test={test} />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Pagination */}
        {!loading && !error && readingTests.length > 0 && (
          <Pagination
            testsPerPage={testsPerPage}
            totalTests={readingTests.length}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        )}
      </div>
    </div>
  );
}

export default IeltsListReading;