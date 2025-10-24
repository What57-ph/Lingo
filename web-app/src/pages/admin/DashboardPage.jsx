import { Typography } from 'antd';
import { Title } from 'chart.js';
import React from 'react';
import NumberStatistic from '../../components/admin/dashboard/NumberStatistic';
import BaseStatistic from '../../components/admin/dashboard/BaseStatistic';
import CurrentAttemptsTable from '../../components/admin/dashboard/CurrentAttemptsTable';

const DashboardPage = () => {
    const sampleAttempt = [100, 200, 300, 400, 500, 600, 700, 129, 384, 842, 292, 323]
    const ieltsAverageScoreData = {
        label: ["IELTS GT Mock 1", "IELTS AC Mock 2", "IELTS Speaking Test", "IELTS Writing Task 1", "IELTS Listening Set A"],
        sampleData: [6.8, 7.0, 7.5, 6.5, 7.2],
        type: "score-ielts"
    }
    const toeicAverageScoreData = {
        label: ["TOEIC ETS Test 5", "TOEIC Reading Set B", "TOEIC Listening Practice", "TOEIC Test 4", "TOEIC Full Test 2023"],
        sampleData: [850, 790, 880, 830, 910],
        type: "score-toeic"
    }
    const sampleToeicScore = [850, 790, 880, 830, 910]
    return (
        <div>
            <Typography.Text strong className='!text-3xl'>
                Lingo Quiz Management Dashboard
            </Typography.Text>
            <NumberStatistic />
            <BaseStatistic sampleData={sampleAttempt} type={"attempt"} label={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]} />
            <div className='grid grid-cols-2 gap-6'>

                <BaseStatistic
                    sampleData={ieltsAverageScoreData.sampleData}
                    label={ieltsAverageScoreData.label}
                    type={ieltsAverageScoreData.type}
                />

                <BaseStatistic
                    sampleData={toeicAverageScoreData.sampleData}
                    label={toeicAverageScoreData.label}
                    type={toeicAverageScoreData.type}
                />
            </div>
            <CurrentAttemptsTable />
        </div>
    );
};

export default DashboardPage;