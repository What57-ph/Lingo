import React from "react";
import { useSelector } from "react-redux";

const SideProgress = ({
    parts,
    questionsPerPart,
    currentIndex,
    setCurrentIndex,
    questionToGroupIndex,
    questionRefs,
    activeQuestion,
    setActiveQuestion
}) => {
    const { userAnswers } = useSelector((state) => state.questions);

    const handleClick = (qNum) => {
        const targetGroup = questionToGroupIndex[qNum];
        if (targetGroup !== undefined) {
            setCurrentIndex(targetGroup);
            setActiveQuestion(qNum);
            setTimeout(() => {
                questionRefs.current[qNum]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
        }
    };

    return (
        <div className="w-full h-full">

            <div className="mb-6 pt-4">
                <div className=" text-xs text-gray-600 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-col">
                        <div className="w-6 h-6 rounded-md bg-blue-500 flex-shrink-0"></div>
                        <span>Current</span>
                    </div>
                    <div className="flex items-center gap-2 flex-col">
                        <div className="w-6 h-6 rounded-md bg-blue-50 border-2 border-blue-500 flex-shrink-0"></div>
                        <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2 flex-col">
                        <div className="w-6 h-6 rounded-md bg-white border border-gray-300 flex-shrink-0"></div>
                        <span>Not answered</span>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                {parts.map((part, index) => {
                    const numQuestionPreviousPart = parts
                        .slice(0, index)
                        .reduce((acc, p) => acc + questionsPerPart[p], 0);

                    return (
                        <div key={part} className="pb-4 border-b border-gray-100 last:border-b-0">

                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                    {index + 1}
                                </div>
                                <span className="text-sm font-semibold text-gray-800">
                                    {part}
                                </span>
                            </div>


                            <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: questionsPerPart[part] }, (_, i) => {
                                    const qNum = numQuestionPreviousPart + i + 1;
                                    const isAnswered = userAnswers?.find(
                                        (a) => a?.questionNumber === qNum && a?.userAnswer !== ""
                                    );
                                    const isActive = activeQuestion === qNum;

                                    return (
                                        <button
                                            key={`${part}-${qNum}`}
                                            onClick={() => handleClick(qNum)}
                                            className={`
                                                w-full aspect-square rounded-md
                                                flex items-center justify-center
                                                text-sm font-medium
                                                transition-all duration-200
                                                hover:scale-105
                                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                                                ${isActive
                                                    ? "bg-blue-500 text-white shadow-md"
                                                    : isAnswered
                                                        ? "bg-blue-50 text-blue-600 border-2 border-blue-500"
                                                        : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                                                }
                                            `}
                                        >
                                            {qNum}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default SideProgress;