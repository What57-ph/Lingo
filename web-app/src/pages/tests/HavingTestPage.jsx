import React, { useEffect, useState } from 'react';
import TimeFrame from '../../components/tests/TimeFrame';
import MainContent from '../../components/tests/MainContent';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { retrieveQuestionForTest } from '../../slice/questions';
import { retrieveSingleTest } from '../../slice/tests';
import { Spin } from 'antd';

const HavingTestPage = () => {
    const [editMode, setEditMode] = useState(false);
    const { id, name } = useParams();
    const dispatch = useDispatch();
    const { questions, userAnswers } = useSelector((state) => state.questions);
    const { test } = useSelector((state) => state.test);
    const [isLoadingImages, setIsLoadingImages] = useState(true);
    useEffect(() => {
        const getQuestionsOfTest = async (id) => {
            await dispatch(retrieveQuestionForTest(id));
        }
        const getTestData = async (id) => {
            await dispatch(retrieveSingleTest(id));
        }
        getQuestionsOfTest(id);
        getTestData(id);
    }, [id]);

    useEffect(() => {
        if (!questions?.length) return;

        const imageUrls = questions
            .map(q => q.resourceContent)
            .filter(url => typeof url === "string" && url.match(/\.(jpg|jpeg|png|gif|webp)$/i));

        if (!imageUrls.length) {
            setIsLoadingImages(false);
            return;
        }
        const cachedImages = new Set();
        const loadImage = url =>
            new Promise(resolve => {
                if (cachedImages.has(url)) return resolve(url);
                const img = new Image();
                img.onload = () => { cachedImages.add(url); resolve(url); };
                img.onerror = () => resolve(url);
                img.src = url;
            });

        Promise.all(imageUrls.map(loadImage))
            .then(() => setIsLoadingImages(false))
            .catch(() => setIsLoadingImages(false));
    }, [questions]);


    if (isLoadingImages) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Loading questions..." />
            </div>
        );
    }
    // console.log("test data:", test)
    // console.log("question data:", questions)
    // console.log(userAnswers)
    return (
        <>
            <TimeFrame editMode={editMode} setEditMode={setEditMode} questions={questions} />
            <MainContent editMode={editMode} testTitle={name} testId={id} />
        </>
    );
};

export default HavingTestPage;