import React, { useRef, useState, useCallback } from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import SideProgress from './SideProgress';
import QuestionCard from './QuestionCard';

const MainContent = React.memo(({ editMode, testTitle, testId }) => {
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [listQuestionNumber, setListQuestionNumber] = useState(0);
    const [isSideProgressOpen, setIsSideProgressOpen] = useState(false);
    const questionRefs = useRef({});
    const { questions } = useSelector((state) => state.questions);

    const groupedArray = React.useMemo(() => {
        const groupQuestionByPartAndResource = _(questions)
            .groupBy("part")
            .mapValues((partGroup) => _.groupBy(partGroup, "resourceContent"))
            .value();

        return Object.entries(groupQuestionByPartAndResource).map(([part, resources]) => ({
            part,
            resources: Object.entries(resources).map(([resourceContent, questions]) => ({
                resourceContent,
                questions,
            })),
        }));
    }, [questions]);

    console.log("groupedArray", groupedArray);

    const questionCardComponents = React.useMemo(() =>

        groupedArray.map(({ part, resources }) => (
            <div key={part} className="mb-8">
                <div className="ml-8 my-4 w-[90%]">
                    <audio controls className="w-full">
                        <source src={groupedArray[listQuestionNumber].resources[0].questions[0].explanationResourceContent} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
                {resources.map(({ resourceContent, questions }, index) => (
                    <QuestionCard
                        key={`${part}-${index}`}
                        questions={questions}
                        groupKey={part}
                        questionRefs={questionRefs}
                        resourceContent={resourceContent}
                        editMode={editMode}
                        activeQuestion={activeQuestion}
                        setActiveQuestion={setActiveQuestion}
                        explanationResourceContent={questions[0].explanationResourceContent}
                    />
                ))}
            </div>
        )),
        [groupedArray, editMode, activeQuestion]
    );

    const movePage = useCallback(
        (action) => {
            setListQuestionNumber((prev) => {
                let newIndex = prev;
                if (action === 'next') newIndex = Math.min(prev + 1, questionCardComponents.length - 1);
                if (action === 'previous') newIndex = Math.max(prev - 1, 0);

                // find first question of the next/prev part
                const currentPart = groupedArray[newIndex];
                const firstQuestion = currentPart?.resources?.[0]?.questions?.[0];
                if (firstQuestion) {
                    setActiveQuestion(firstQuestion.questionNumber);
                    setTimeout(() => {
                        questionRefs.current[firstQuestion.questionNumber]?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        });
                    }, 100);
                }
                return newIndex;
            });
        },
        [groupedArray, questionCardComponents.length]
    );

    const questionToGroupIndex = React.useMemo(() => {
        const map = {};
        groupedArray.forEach((group, groupIdx) => {
            group.resources.forEach(({ questions }) => {
                questions.forEach((q) => {
                    map[q.questionNumber] = groupIdx;
                });
            });
        });
        return map;
    }, [groupedArray]);
    console.log("audio for", listQuestionNumber, groupedArray[listQuestionNumber].resources[0].questions[0].explanationResourceContent);
    return (
        <main className="flex min-h-screen flex-col lg:flex-row">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-8">
                    <div className="flex justify-between items-center mb-4 lg:hidden">
                        <Button
                            type="primary"
                            className="w-32 h-10"
                            onClick={() => setIsSideProgressOpen(!isSideProgressOpen)}
                        >
                            {isSideProgressOpen ? 'Hide Progress' : 'Show Progress'}
                        </Button>
                    </div>

                    {questionCardComponents[listQuestionNumber]}

                    <div className={`flex ${editMode ? 'mt-16' : 'mt-6'} justify-between`}>
                        <Button
                            type="primary"
                            className="rounded-lg bg-black w-32 h-12 hover:bg-gray-700 text-white mx-2 sm:mx-4"
                            onClick={() => movePage('previous')}
                            disabled={listQuestionNumber === 0}
                        >
                            Previous Part
                        </Button>
                        <Button
                            type="primary"
                            className="rounded-lg w-32 h-12 mx-2 sm:mx-4"
                            onClick={() => movePage('next')}
                            disabled={listQuestionNumber === questionCardComponents.length - 1}
                        >
                            Next Part
                        </Button>
                    </div>
                </div>
            </div>

            <aside
                className={`${isSideProgressOpen ? 'block' : 'hidden'} lg:block lg:sticky lg:top-6 lg:self-start
                    fixed inset-x-0 bottom-0 z-50 lg:relative lg:inset-auto w-full lg:w-60 
                    h-fit bg-white border-t lg:border-t-0 lg:border-l border-gray-200 
                    p-4 sm:p-6 rounded-t-xl lg:rounded-xl shadow-lg lg:shadow-none lg:mr-6 mt-6`}
            >
                <SideProgress
                    parts={groupedArray.map((g) => g.part)}
                    questionsPerPart={_.mapValues(_.groupBy(questions, 'part'), (qs) => qs.length)}
                    currentIndex={listQuestionNumber}
                    setCurrentIndex={setListQuestionNumber}
                    questionToGroupIndex={questionToGroupIndex}
                    questionRefs={questionRefs}
                    activeQuestion={activeQuestion}
                    setActiveQuestion={setActiveQuestion}
                    isSideProgressOpen={isSideProgressOpen}
                />
            </aside>

            {isSideProgressOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsSideProgressOpen(false)}
                />
            )}
        </main>
    );
});

export default MainContent;
