import React from 'react';
import { Space, Table, Tag } from 'antd';
import { formatTime, getCategoryStyle, getScoreStyle } from '../../../service/GlobalFunction';
import { BackwardFilled, ClockCircleFilled, ClockCircleOutlined, EyeFilled, EyeInvisibleOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { realData } from '../../../data/MockData';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
const columns = [
  {
    title: 'Ngày làm ',
    dataIndex: 'submittedAt',
    key: 'submittedAt',
    sorter: (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    render: (_, record) => (
      <div>
        <div className="text-sm font-medium text-gray-900">{record.submittedAt.split("T")[0].split("-").join("/")}</div>
        {/* <div className="text-sm text-gray-500">{record.submittedAt.split("T")[1].split(".")[0]}</div> */}
      </div>
    )
  },
  {
    title: 'Tên đề thi',
    dataIndex: 'quizInfo',
    render: (_, record) => (
      <div>
        <div className="text-sm font-medium text-gray-900">IELTS Academic Reading Practice Test 1</div>
        {/* <div className="text-sm text-gray-500">{record.quizInfo.details}</div> */}
      </div>
    )
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type',
    render: (_, record) => {
      const { bg, text } = getCategoryStyle(record.type);
      return (
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${bg} ${text}`}>
          <span className="font-medium">{record.type}</span>
          <div className="flex items-center gap-1">
            {record.sectionResults?.map((sec, idx) => (
              <span key={idx} className="text-xs font-normal">
                {sec.type}
              </span>
            ))}
          </div>
        </div>
      );
    }
  },
  {
    title: 'Kết quả',
    dataIndex: 'score',
    key: 'score',
    render: (_, record) => {
      // Tính toán dữ liệu
      const totalCorrect = record.sectionResults?.reduce(
        (sum, sec) => sum + (sec.correctAnswers || 0),
        0
      ) || 0;

      const totalQuestions = record.sectionResults?.reduce(
        (sum, sec) => sum + (sec.totalQuestions || 0),
        0
      ) || 1;

      // const accuracy = ((totalCorrect / totalQuestions) * 100).toFixed(0);

      let mainScore = "";
      let maxScore = "";
      let displayScore = 0;

      if (record.type === "IELTS") {
        displayScore = ((totalCorrect / totalQuestions) * 9).toFixed(1);
        mainScore = `${displayScore}/9.0`;
      } else if (record.type === "TOEIC") {
        displayScore = record.sectionResults?.reduce(
          (sum, sec) => sum + (sec.sectionScore || 0),
          0
        ) || 0;
        maxScore = record.sectionResults?.reduce(
          (sum, sec) => sum + (sec.maxPossibleScore || 0),
          0
        ) || 990;
        mainScore = `${displayScore}/${maxScore}`;
      } else if (record.type === "TOEFL") {
        displayScore = record.sectionResults?.reduce(
          (sum, sec) => sum + (sec.sectionScore || 0),
          0
        ) || 0;
        maxScore = record.sectionResults?.reduce(
          (sum, sec) => sum + (sec.maxPossibleScore || 0),
          0
        ) || 120;
        mainScore = `${displayScore}/${maxScore}`;
      }

      const colorClass = getScoreStyle(record.type, displayScore);

      return (
        <div className="text-sm  flex flex-row items-center space-x-2">
          <div className={`inline-block px-2 py-1 rounded-2xl font-medium ${colorClass}`}>
            {mainScore}
          </div>
          {/* <div>
            <div className="text-sm text-gray-500">{totalCorrect}/{totalQuestions} đúng</div>
            <div className="text-sm text-gray-500">{accuracy}% chính xác</div>
          </div> */}
        </div>
      );
    }
  },
  {
    title: 'Thời gian',
    dataIndex: 'timeTaken',
    key: 'timeTaken',
    render: (_, record) => <div> <ClockCircleOutlined /> {formatTime(record.timeTaken)}</div>
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Link className="!text-blue-600 hover:!text-blue-900 !mr-3"><EyeOutlined /> Xem chi tiết</Link>
        <Link className="!text-green-600 hover:!text-green-900"><ReloadOutlined /> Làm lại</Link>
      </Space>
    ),
  },
];



const HistoryAttempt = ({ type, time }) => {
  const { attempts } = useSelector(state => state.attempts);

  const filterByType = (list, type) => {
    if (!type) return list;
    return list.filter(attempt => attempt.type.toLowerCase() === type.toLowerCase());
  };

  const filterByTime = (list, time) => {
    if (!time) return list;

    const now = dayjs();
    let threshold;

    if (time === "30") {
      threshold = now.subtract(30, "day");
    } else if (time === "7") {
      threshold = now.subtract(7, "day");
    } else if (time === "3") {
      threshold = now.subtract(3, "month");
    }

    return list.filter(attempt => dayjs(attempt.submittedAt).isAfter(threshold));
  };

  // Áp dụng filter
  let filteredAttempts = filterByType(attempts, type);
  filteredAttempts = filterByTime(filteredAttempts, time);

  return (
    <Table
      columns={columns}
      scroll={{ x: 'max-content' }}
      dataSource={filteredAttempts}
      pagination={{
        pageSize: 8,
        showTotal: (total, range) =>
          `Hiển thị ${range[0]} đến ${range[1]} trong tổng số ${total} kết quả`,
      }}
    />
  );
};


export default HistoryAttempt;