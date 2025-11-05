import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputColumn from "../components-ATI/writing/InputColumn";

const MOCK_TEST_DATA = {
  id: 1,
  taskType: 1,
  promptText:
    "The chart below shows the changes in the percentage of the population in four European countries who bought different types of products online from 2018 to 2022.",
  promptImage: "https://i.imgur.com/gim2k9g.png",
};

function IeltsGraderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: testId } = useParams();

  const isLockMode = !!testId;

  const [pageLoading, setPageLoading] = useState(isLockMode);

  const [lockedData, setLockedData] = useState(null);

  useEffect(() => {
    if (isLockMode) {
      setPageLoading(true);

      console.log(`(Mock) Đang fetch test với ID: ${testId}`);
      setTimeout(() => {
        setLockedData(MOCK_TEST_DATA);
        setPageLoading(false);
      }, 1000);

      // --- PHẦN LOGIC REDUX THẬT (COMMENT LẠI ĐỂ DÙNG SAU) ---
      /*
      dispatch(retrieveSingleTest(testId))
        .unwrap()
        .then((testData) => {
          // Chuẩn hóa dữ liệu nếu cần, ví dụ:
          // const formattedData = {
          //   id: testData.id,
          //   taskType: testData.taskType, // Đảm bảo key khớp
          //   promptText: testData.promptText,
          //   promptImage: testData.imageUrl 
          // };
          // setLockedData(formattedData);
          setLockedData(testData); 
        })
        .catch((error) => {
          console.error("Không tìm thấy bài test:", error);
          setLockedData(null); // Đặt là null để hiển thị lỗi
        })
        .finally(() => {
          setPageLoading(false);
        });
      */
    }
  }, [testId, isLockMode, dispatch]);

  const handleGrade = useCallback(
    (formData) => {
      setIsLoading(true);
      console.log("Đang gửi đi để chấm điểm:", formData);

      const navigationState = {
        formData,
        promptData: lockedData || { // 'lockedData' từ state
          taskType: formData.task,
          promptText: formData.prompt,
          promptImage: formData.image,
        },
      };

      setTimeout(() => {
        setIsLoading(false);
        navigate("/WritingDone", { state: navigationState });
      }, 2500);
    },
    [navigate, lockedData] // Phụ thuộc vào 'lockedData' từ state
  );

  // 6. HÀM RENDER NỘI DUNG CHÍNH
  const renderContent = () => {
    // Kịch bản 1: Đang ở luồng "Bài Test" VÀ đang tải đề
    if (isLockMode && pageLoading) {
      return (
        <div className="text-center p-20 bg-white rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">
            Đang tải đề bài...
          </h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
        </div>
      );
    }

    if (isLockMode && !pageLoading && !lockedData) {
      return (
        <div className="text-center p-20 bg-red-50 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-2xl font-semibold text-red-700">Lỗi</h2>
          <p className="text-red-600 mt-2">
            Không tìm thấy bài test với ID: {testId}.
          </p>
        </div>
      );
    }

    return (
      <InputColumn
        onGrade={handleGrade}
        isLoading={isLoading}
        lockedData={lockedData}
      />
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 md:p-10 rounded-xl shadow-lg mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            AI Writing Assessment
          </h1>
          <p className="text-lg md:text-xl text-indigo-100">
            Nhập đề bài và bài làm của bạn để được chấm điểm chi tiết.
          </p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default IeltsGraderPage;