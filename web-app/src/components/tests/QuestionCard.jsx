import React, { useCallback } from 'react';
import { Button, Card, Form, Image, Input, Radio, Upload } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'antd/es/form/Form';
import { FaUpload } from 'react-icons/fa';
import TextEditor from './TextEditor'; // Import the new wrapper
import { checkType } from '../../utils/checkType';
import { getUserAnswers, modifyQuestion } from '../../slice/questions';
import { modifyAnswer } from '../../slice/answers';
import { saveUpdatingResourceMedia, saveUpdatingExplanationResourceContent } from '../../slice/files';

const QuestionCard = React.memo(({ groupKey, questionRefs, resourceContent, editMode, questions, activeQuestion, setActiveQuestion }) => {
    const [form] = useForm();
    const dispatch = useDispatch();
    const { fileUpdating } = useSelector((state) => state.file);

    // Memoize handlers to prevent re-renders
    const handleAnswerChange = useCallback((qId, userAnswerId, isCorrect, questionTitle, userAnswer, questionNumber) => {
        dispatch(getUserAnswers({
            questionId: qId,
            questionTitle,
            userAnswerId,
            userAnswer,
            isCorrect,
            questionNumber,
        }));
    }, [dispatch]);

    const handleSaveAll = useCallback((values) => {
        const isUrl = checkType(resourceContent) === 'url';
        questions.forEach((question, questionIndex) => {
            const updatingQuestion = {
                title: values.questions[questionIndex].title,
                point: question.point,
                answerKey: values.questions[questionIndex].correct,
                explanation: values.questions[questionIndex].explanation,
                part: question.part,
                questionNumber: question.questionNumber,
                category: question.category,
                resourceContent: isUrl ? question.resourceContent : values.passage,
                explanationResourceContent: question.explanationResourceContent,
            };
            dispatch(modifyQuestion({ id: question.id, question: updatingQuestion }));

            question.answers.forEach((answer, answerIndex) => {
                const updatingAnswer = {
                    content: values.questions[questionIndex].answers[answerIndex].content,
                    correct: String.fromCharCode(65 + answerIndex) === values.questions[questionIndex].correct,
                };
                dispatch(modifyAnswer({ id: answer.id, answer: updatingAnswer }));
            });
        });
    }, [dispatch, questions, resourceContent]);

    const handleUpdateContentImage = useCallback(({ file }) => {
        dispatch(saveUpdatingResourceMedia({
            resourceId: Number(questions[0].resourceContentId),
            testTitle: questions[0].testTitle,
            fileCategory: 'QUESTION_IMAGE',
            currentResourceContent: questions[0]?.resourceContent,
            file,
            updatedFileName: questions[0].resourceContent.split('/').pop(),
        }));
    }, [dispatch, questions]);

    const handleUpdateExplanationResource = useCallback(({ file }, updatingQuestion) => {
        dispatch(saveUpdatingExplanationResourceContent({
            questionId: updatingQuestion.questionId,
            testTitle: updatingQuestion.testTitle,
            fileCategory: 'QUESTION_AUDIO',
            currentResourceContent: updatingQuestion.currentResourceContent,
            file,
            updatedFileName: updatingQuestion.currentResourceContent.split('/').pop(),
        }));
    }, [dispatch]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveAll}
            initialValues={{
                passage: resourceContent,
                questions: questions.map((q) => ({
                    title: q.title,
                    answers: q.answers?.map((a) => ({ content: a.content })),
                    correct: q.answers?.find((ans) => ans.correct === 'true')
                        ? String.fromCharCode(65 + q.answers.findIndex((ans) => ans.correct === 'true'))
                        : null,
                    explanation: q.explanation || '',
                })),
            }}
            className="space-y-4"
        >
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* Passage section */}
                <div className="flex-1">
                    {editMode ? (
                        checkType(resourceContent) === 'url' ? (
                            <div className="border border-dashed rounded-lg p-4 bg-gray-50">
                                <p className="font-medium mb-2">Cập nhật hình ảnh câu hỏi</p>
                                <Upload.Dragger
                                    customRequest={handleUpdateContentImage}
                                    fileList={null}
                                    multiple={false}
                                    className="h-48 flex flex-col justify-center items-center"
                                >
                                    <FaUpload className="text-4xl text-gray-600 mb-2" />
                                    <span className="text-sm">Kéo thả hoặc <span className="text-blue-500">chọn file</span></span>
                                </Upload.Dragger>
                            </div>
                        ) : (
                            <Form.Item name="passage" label="Nội dung câu hỏi (đoạn văn)">
                                <TextEditor />
                            </Form.Item>
                        )
                    ) : (
                        resourceContent !== 'null' && (
                            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                <h5 className="text-sm text-blue-600 font-medium mb-2">
                                    Questions {questions[0]?.questionNumber}
                                    {questions.length > 1 && ` - ${questions[questions.length - 1]?.questionNumber}`}
                                </h5>
                                {checkType(resourceContent) === 'url' ? (
                                    <Image src={resourceContent} className="rounded-md max-w-full h-auto" />
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: resourceContent }} className="prose max-w-none" />
                                )}
                            </div>
                        )
                    )}
                </div>

                {/* Questions section */}
                <div className="flex-1 space-y-4">
                    {questions.map((q, qId) => (
                        <Card
                            key={q.id}
                            ref={(el) => (questionRefs.current[q.questionNumber] = el)}
                            className="border-2 border-gray-200 rounded-lg shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    onClick={() => setActiveQuestion(q.questionNumber)}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold cursor-pointer
                    ${activeQuestion === q.questionNumber ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}
                                >
                                    {q.questionNumber}
                                </div>
                                <div className="flex-1">
                                    {editMode ? (
                                        <Form.Item name={['questions', qId, 'title']} label={`Question ${q.questionNumber}`}>
                                            <Input.TextArea rows={2} className="w-full" />
                                        </Form.Item>
                                    ) : (
                                        <h4 className="text-base sm:text-lg font-semibold mb-3">
                                            {q.title || `Question ${q.iId}`}
                                        </h4>
                                    )}
                                    {editMode ? (
                                        <>
                                            {q.answers?.map((ans, aId) => (
                                                <Form.Item
                                                    key={ans.id}
                                                    name={['questions', qId, 'answers', aId, 'content']}
                                                    label={`Answer ${aId + 1}`}
                                                >
                                                    <Input className="w-full" />
                                                </Form.Item>
                                            ))}
                                            <Form.Item name={['questions', qId, 'correct']} label="Correct Answer">
                                                <Radio.Group className="flex flex-col gap-2">
                                                    {q.answers?.map((_, aId) => (
                                                        <Radio key={aId} value={String.fromCharCode(65 + aId)}>
                                                            Answer {aId + 1}
                                                        </Radio>
                                                    ))}
                                                </Radio.Group>
                                            </Form.Item>
                                            <Form.Item name={['questions', qId, 'explanation']} label="Giải thích">
                                                <TextEditor />
                                            </Form.Item>
                                            <p className="font-medium">Thêm file cho phần giải thích (tùy chọn)</p>
                                            <Upload.Dragger
                                                customRequest={(options) => handleUpdateExplanationResource(options, {
                                                    questionId: q.id,
                                                    testTitle: q.testTitle,
                                                    fileCategory: 'QUESTION_AUDIO',
                                                    currentResourceContent: q.explanationResourceContent,
                                                    file: options.file,
                                                    updatedFileName: q.explanationResourceContent.split('/').pop(),
                                                })}
                                                fileList={null}
                                                multiple={false}
                                                className="h-32 flex flex-col justify-center items-center my-4"
                                            >
                                                <p className="text-base font-medium">Kéo thả file vào đây</p>
                                                <span className="text-sm">hoặc <span className="text-blue-400">chọn file</span></span>
                                            </Upload.Dragger>
                                        </>
                                    ) : (
                                        <Radio.Group
                                            onChange={(e) => handleAnswerChange(
                                                q.id,
                                                e.target.value,
                                                q.answers.find((a) => a.id === e.target.value)?.correct,
                                                q.title,
                                                q.answers.find((a) => a.id === e.target.value)?.content,
                                                q.questionNumber
                                            )}
                                            value={q.id in (form.getFieldValue('answers') || {}) ? form.getFieldValue('answers')[q.id]?.userAnswerId : undefined}
                                            className="flex flex-col gap-3"
                                        >
                                            {q.answers?.map((ans) => ans.content && (
                                                <Radio key={ans.id} value={ans.id} className="text-sm sm:text-base">
                                                    {ans.content}
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            {editMode && (
                <Form.Item className="mt-4 flex justify-end">
                    <Button type="primary" htmlType="submit" className="w-32 h-12">
                        Save All
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
});

export default QuestionCard;