import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';

const SideProgress = React.memo(({ parts, questionsPerPart, currentIndex, setCurrentIndex, questionToGroupIndex, questionRefs, activeQuestion, setActiveQuestion }) => {
    const { userAnswers } = useSelector((state) => state.questions);

    const handleClick = useCallback((qNum) => {
        const targetGroup = questionToGroupIndex[qNum];
        if (targetGroup !== undefined) {
            setCurrentIndex(targetGroup);
            setActiveQuestion(qNum);
            setTimeout(() => {
                questionRefs.current[qNum]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 100);
        }
    }, [questionToGroupIndex, setCurrentIndex, setActiveQuestion, questionRefs]);

    return (
        <div className="space-y-6">
            {parts.map((part, index) => {
                const numQuestionPreviousPart = parts
                    .slice(0, index)
                    .reduce((acc, p) => acc + questionsPerPart[p], 0);

                return (
                    <div key={part} className="mb-6">
                        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2">
                                {part?.split(' ')[1]}
                            </span>
                            {part}
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                            {Array.from({ length: questionsPerPart[part] }, (_, i) => {
                                const qNum = numQuestionPreviousPart + i + 1;
                                return (
                                    <div
                                        key={`${part}-${qNum}`}
                                        onClick={() => handleClick(qNum)}
                                        className={`w-10 h-10 rounded border flex items-center justify-center text-sm font-medium cursor-pointer transition-colors
                      ${userAnswers?.find((a) => a?.question?.questionNumber === qNum)
                                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 bg-white hover:bg-gray-50'}
                      ${activeQuestion === qNum ? '!bg-blue-500 !text-white' : ''}`}
                                    >
                                        {qNum}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default SideProgress;