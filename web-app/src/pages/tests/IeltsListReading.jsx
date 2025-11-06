import React, { useState } from "react";
// --- THAY ĐỔI: Import thêm BrowserRouter ---
import { Link, BrowserRouter } from "react-router-dom";

// --- Data giả lập cho các đề thi (Đã cập nhật sang Reading) ---
const testSectionsData = [
  {
    title: "Cambridge IELTS Academic 1",
    tests: [
      { id: "c15_t1", title: "C15 Reading Test 1 AC", progress: 0 },
      { id: "c15_t2", title: "C15 Reading Test 2 AC", progress: 0 },
      { id: "c15_t3", title: "C15 Reading Test 3 AC", progress: 0 },
      { id: "c15_t4", title: "C15 Reading Test 4 AC", progress: 0 },
    ],
  },
  {
    title: "Cambridge IELTS Academic 2",
    tests: [
      { id: "c14_t1", title: "C14 Reading Test 1 AC", progress: 0 },
      { id: "c14_t2", title: "C14 Reading Test 2 AC", progress: 0 },
      { id: "c14_t3", title: "C14 Reading Test 3 AC", progress: 0 },
      { id: "c14_t4", title: "C14 Reading Test 4 AC", progress: 0 },
    ],
  },
  {
    title: "Cambridge IELTS Academic 3",
    tests: [
      { id: "c13_t1", title: "C13 Reading Test 1 AC", progress: 0 },
      { id: "c13_t2", title: "C13 Reading Test 2 AC", progress: 0 },
      { id: "c13_t3", title: "C13 Reading Test 3 AC", progress: 0 },
      { id: "c13_t4", title: "C13 Reading Test 4 AC", progress: 0 },
    ],
  },
  {
    title: "Cambridge IELTS Academic 4",
    tests: [
      { id: "c12_t1", title: "C12 Reading Test 1 AC", progress: 0 },
      { id: "c12_t2", title: "C12 Reading Test 2 AC", progress: 0 },
      { id: "c12_t3", title: "C12 Reading Test 3 AC", progress: 0 },
      { id: "c12_t4", title: "C12 Reading Test 4 AC", progress: 0 },
    ],
  },
  {
    title: "Cambridge IELTS Academic 5",
    tests: [
      { id: "c11_t1", title: "C11 Reading Test 1 AC", progress: 0 },
      { id: "c11_t2", title: "C11 Reading Test 2 AC", progress: 0 },
      { id: "c11_t3", title: "C11 Reading Test 3 AC", progress: 0 },
      { id: "c11_t4", title: "C11 Reading Test 4 AC", progress: 0 },
    ],
  },
  {
    title: "Cambridge IELTS Academic 6",
    tests: [
      { id: "c10_t1", title: "C10 Reading Test 1 AC", progress: 0 },
      { id: "c10_t2", title: "C10 Reading Test 2 AC", progress: 0 },
      { id: "c10_t3", title: "C10 Reading Test 3 AC", progress: 0 },
      { id: "c10_t4", title: "C10 Reading Test 4 AC", progress: 0 },
    ],
  },
];

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

const SettingsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-300 hover:text-gray-500 transition-colors"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const FileTextIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-300 hover:text-gray-500 transition-colors"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

// --- Component Card Đề thi (Theme: Teal) ---
const TestCard = ({ test }) => {
  return (
    <div className="bg-white border border-teal-300 rounded-lg shadow-sm p-4 flex flex-col items-center text-center h-full">
      <div className="bg-teal-600 text-white rounded-md w-8 h-8 flex items-center justify-center font-bold text-lg mb-2">
        P
      </div>
      <h3 className="text-sm font-semibold text-gray-700 min-h-[2.8rem] flex items-center">
        {test.title}
      </h3>
      <div className="text-2xl font-bold text-teal-600 my-2">
        {test.progress}%
      </div>
      <Link
        to="/reading-test"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-200 btn-hover"
      >
        <LightningIcon />
        Take Test
      </Link>
    </div>
  );
};

// --- Component Nhóm Đề thi (Theme: Teal) ---
const TestSection = ({ title, tests }) => {
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="border border-teal-300 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Component Pagination (Theme: Teal) ---
const Pagination = ({
  sectionsPerPage,
  totalSections,
  setCurrentPage,
  currentPage,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalSections / sectionsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Xử lý nút Prev/Next
  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <nav className="flex justify-center items-center gap-2 mt-8">
      {/* Nút Previous */}
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

      {/* Các nút số trang */}
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

      {/* Nút Next */}
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
  const [sectionsPerPage] = useState(4); // Hiển thị 4 quyển mỗi trang

  // Logic tính toán các section cho trang hiện tại
  const indexOfLastSection = currentPage * sectionsPerPage;
  const indexOfFirstSection = indexOfLastSection - sectionsPerPage;

  // Lấy ra đúng các sections cho trang hiện tại
  const currentSections = testSectionsData.slice(
    indexOfFirstSection,
    indexOfLastSection
  );

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
            Kho đề IELTS Reading Academic từ Cambridge và bộ đề thi thật (Actual
            Tests).
          </p>
        </header>

        <main>
          {/* Map qua 'currentSections' */}
          {currentSections.map((section) => (
            <TestSection
              key={section.title}
              title={section.title}
              tests={section.tests}
            />
          ))}
        </main>

        {/* Thêm component Pagination */}
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

// Component App mới để bọc BrowserRouter

export default IeltsListReading;
