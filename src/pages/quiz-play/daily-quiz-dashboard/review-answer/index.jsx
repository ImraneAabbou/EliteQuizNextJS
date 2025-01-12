"use client"
import { t } from "src/utils";
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { questionsData } from 'src/store/reducers/tempDataSlice'
import { Suspense } from 'react'
import QuestionSkeleton from 'src/components/view/common/QuestionSkeleton'
const ReviewAnswer = dynamic(() => import('src/components/Common/ReviewAnswer'), { ssr: false })

const Index = () => {

  const navigate = useRouter()

  const questions = useSelector(questionsData)



  const handleReviewAnswerBack = () => {
    navigate.push("/quiz-play/daily-quiz-dashboard/result")
  }

  return (
    <Layout>
      <Breadcrumb title={`${t('daily')} ${t('quiz')}`} content="" contentTwo="" />
      <div className='dashboard'>
        <div className='container'>
          <div className='row '>
            <div className=''>
              <div className='whitebackground'>
                <Suspense fallback={<QuestionSkeleton />}>
                  <ReviewAnswer
                    showLevel={false}
                    reviewlevel={false}
                    reportquestions={true}
                    questions={questions}
                    latex={true}
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