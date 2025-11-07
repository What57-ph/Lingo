import React from "react";

export default function WritingAnalysisPanel({ width, aiData, wordCount }) {
  const { scores, status, errors, suggestions } = aiData;
  const overallScore = scores.overall || 0;
  const scoreAngle = (overallScore / 9) * 360; // Tính toán góc cho điểm

  return (
    <div
      style={{ width: `${width}%` }}
      className="bg-gray-50 overflow-hidden flex flex-col"
    >
      <div className="bg-gradient-to-b from-blue-400 to-indigo-400 text-black px-6 py-4">
        <h2 className="text-lg font-semibold">Đánh giá AI chi tiết</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Overall Score */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Score tổng quan
          </h3>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(from 0deg, #14b8a6 ${scoreAngle}deg, #e5e7eb ${scoreAngle}deg, #e5e7eb 360deg)`,
                  }}
                >
                  <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-teal-600">
                      {overallScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">Điểm tổng</p>
            </div>
            <div className="text-sm text-gray-600">
              <div className="mb-2">
                <strong>Mức độ:</strong> {status.level}
              </div>
              <div className="mb-2">
                <strong>Thời gian:</strong> {status.time}
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                <span className="text-green-600 font-medium">
                  {status.state}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            {/* SVG Icon */}
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            Phân tích lỗi ({errors.length} lỗi được tìm thấy)
          </h3>
          <div className="space-y-4">
            {errors.map((error, index) => (
              <div
                key={index}
                className={`border-l-4 border-${error.color}-400 bg-${error.color}-50 p-4 rounded-r-lg`}
              >
                <div className="flex items-center mb-2">
                  <span
                    className={`bg-${error.color}-100 text-${error.color}-800 text-xs font-medium px-2 py-1 rounded`}
                  >
                    {error.typeVi}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    {error.location}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Lỗi:</strong> "{error.text}" →{" "}
                  <strong>Sửa:</strong> "{error.suggestion}"
                </p>
                <p className="text-xs text-gray-600">{error.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            {/* SVG Icon */}
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.548-1.146l-.548-.547z"></path>
            </svg>
            Gợi ý cải thiện
          </h3>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-transparent hover:border-teal-500 transition-all">
              <h4 className="font-semibold text-green-800 mb-2">
                Điểm mạnh cần duy trì
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                {suggestions.strongPoints.map((item, i) => <li key={i}>• {item}</li>)}
                <li>• Đạt yêu cầu về số từ ({wordCount} từ)</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-transparent hover:border-teal-500 transition-all">
              <h4 className="font-semibold text-blue-800 mb-2">
                Cải thiện ngữ pháp
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {suggestions.grammar.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-transparent hover:border-teal-500 transition-all">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Nâng cao từ vựng
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {suggestions.vocabulary.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-transparent hover:border-teal-500 transition-all">
              <h4 className="font-semibold text-purple-800 mb-2">
                Tăng tính liên kết
              </h4>
              <ul className="text-sm text-purple-700 space-y-1">
                {suggestions.coherence.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}