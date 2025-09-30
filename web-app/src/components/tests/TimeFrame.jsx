import React, { useEffect, useState, useRef } from "react";
import { Button, Progress } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IoIosExit } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { submitUserAnswer } from "../../slice/tests";

const TimeFrame = ({ editMode, setEditMode }) => {
    const dispatch = useDispatch();
    const { userAnswers, questions } = useSelector((state) => state.questions);
    const { test } = useSelector(state => state.test);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [timeLimitFormat, setTimeLimitFormat] = useState();
    useEffect(() => {
        if (test?.timeLimit) {
            setTimeRemaining(test.timeLimit * 60);
        }
    }, [test]);
    useEffect(() => {
        const countDownInterval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(countDownInterval);
                    alert("Time out!");
                    handleSubmitUserAnswers();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countDownInterval);
    }, []);

    useEffect(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        setTimeLimitFormat(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
    }, [timeRemaining]);

    const handleSubmitUserAnswers = () => {
        const timeTaken = test.timeLimit * 60 - timeRemaining;

        dispatch(submitUserAnswer({
            quizId: test?.id || null,
            timeTaken,
            type: test?.type || null,
            fieldId: ["Listening", "Reading"],
            answers: userAnswers
        }));
    };

    return (
        <div className="w-full h-48 px-14 py-4 bg-gradient-to-r from-[#6a11cb] to-[#2575fc]">

            <div className="flex justify-between items-center ">
                <div className="flex gap-3 items-center">
                    <p className="bg-white rounded-lg w-8 h-8 flex justify-center items-center text-lg">📚</p>
                    <p className="text-white font-semibold text-lg">English Proficiency Test</p>
                </div>

                <Button className={`!text-xl ! !border-0 !text-white !p-5 ${editMode ? "!bg-red-500 hover:!bg-red-600" : "!bg-amber-500 hover:!bg-amber-600"}`}
                    onClick={() => setEditMode(!editMode)}>
                    {editMode ? <p className="flex items-center gap-2"><IoIosExit className="text-2xl" /> Exit Edit</p> : <p className="flex items-center gap-2"><FaEdit /> Edit Mode</p>}
                </Button>

                <div className="flex gap-4 items-center">
                    <p className="text-white text-base ">Time: <span className="font-bold">{timeLimitFormat}</span></p>
                    <Button className="!bg-red-600 !h-8 !w-24 !text-white !border-none !px-4 !text-sm hover:!bg-red-700">
                        Exit Test
                    </Button>
                    <Button htmlType="submit" onClick={handleSubmitUserAnswers} className="hover:!bg-black !border-0 w-28">
                        Submit
                    </Button>
                </div>
            </div>
            {test?.mediaUrl && (
                <div className="mt-4">
                    <audio controls className="w-full">
                        <source src={test.mediaUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
            {/* Progress bar */}
            <div className="mt-3">
                <div className="flex justify-between items-center">
                    <p className="text-gray-200 text-[14px] mb-1 font-semibold">Overall Progress</p>
                    <p className="text-white text-[14px] font-semibold">{userAnswers?.length}% Complete</p>
                </div>

                <Progress
                    percent={userAnswers?.length}
                    showInfo={false}
                    strokeColor="#ffffff33"
                    trailColor="#ffffff22"
                />
            </div>
        </div>
    );
};

export default TimeFrame;