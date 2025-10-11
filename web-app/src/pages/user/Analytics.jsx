import { Card, Select } from "antd"
import ExamCate from "../../components/tests/ListPage/ExamCate"
import Statistics from "../../components/client/userInfo/Statistics";
import LineChart from "../../components/client/userInfo/LineChart";
import HistoryAttempt from "../../components/client/userInfo/HistoryAttempt";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { retrieveAttempts } from "../../slice/attempts";

const Analytics = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { attempts } = useSelector(state => state.attempts);
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  console.log(attempts);

  const [hisType, setHisType] = useState("");
  const [hisTime, setHisTime] = useState("30");

  const userId = "b3dbd68b-0613-466c-9037-ebdea8a184c1";

  useEffect(() => {
    dispatch(retrieveAttempts(userId));
  }, [userId, dispatch])

  const handleNavigate = (para, value) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set(para, value);
    navigate({
      pathname: location.pathname,
      search: `${createSearchParams(currentParams)}`
    })
  };

  const filterAttempts = attempts.filter((attempt) => attempt.type.toLowerCase() === category);




  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống kê lịch sử làm bài</h1>
        <p className="text-gray-600">Theo dõi tiến độ học tập và phân tích kết quả của bạn</p>
      </div>

      <Card className="!shadow-md !mb-7 ">
        <ExamCate handleNavigate={handleNavigate} analytics={true} />
      </Card>


      <Statistics attemptData={filterAttempts} />
      <Card className="!shadow-md !mb-7 ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Biểu đồ điểm số 10 lần gần nhất</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Điểm số</span>
            </div>
          </div>
        </div>
        <div className="h-96">
          <LineChart attemptData={filterAttempts} />
        </div>
      </Card>

      <Card className="!shadow-md !mb-7 ">
        <div className="py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Lịch sử làm bài chi tiết</h2>
            <div className="flex items-center !space-x-3">
              <Select
                defaultValue="Tất cả loại bài"
                style={{ width: 120 }}
                onChange={(value) => setHisType(value)}
                options={[
                  { value: '', label: 'Tất cả loại bài' },
                  { value: 'ielts', label: 'IELTS' },
                  { value: 'toeic', label: 'TOEIC' },
                  { value: 'toefl', label: 'TOEFL' },
                ]}
              />
              <Select
                defaultValue="30"
                style={{ width: 120 }}
                onChange={(value) => setHisTime(value)}
                options={[
                  { value: '30', label: '30 ngày gần nhất' },
                  { value: '7', label: '7 ngày gần nhất' },
                  { value: '3', label: '3 tháng gần nhất' },
                  { value: '', label: 'Tất cả' },
                ]}
              />
            </div>
          </div>
        </div>

        <HistoryAttempt type={hisType} time={hisTime} />
      </Card>


    </div>
  )
}
export default Analytics