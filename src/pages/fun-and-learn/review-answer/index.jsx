"use client"
import { t } from "src/utils";
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import QuestionSkeleton from 'src/components/view/common/QuestionSkeleton'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
const ReviewAnswer = dynamic(() => import('src/components/Common/ReviewAnswer'), { ssr: false })
import { questionsData } from 'src/store/reducers/tempDataSlice'

const Index = () => {

    const navigate = useRouter()

    const questions = useSelector(questionsData)

    const handleReviewAnswerBack = () => {
        navigate.push("/fun-and-learn/result")
    }

    return (
        <Layout>
            <Breadcrumb title={`${t('quiz')} ${t('play')}`} content="" contentTwo="" />
            <div className='dashboard'>
                <div className='container'>
                    <div className='row '>
                        <div className=''>
                            <div className='whitebackground'>
                                <Suspense fallback={<QuestionSkeleton />}>
                                    <ReviewAnswer
                                        reportquestions={false}
                                        reviewlevel={false}
                                        questions={questions}
                                        showLevel={false}
                                        goBack={handleReviewAnswerBack}
                                        showBookmark={false}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default Index