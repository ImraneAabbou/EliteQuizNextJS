"use client"
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { getBookmarkData } from 'src/utils'
import { useSelector } from 'react-redux'
import { getmathQuestionsApi } from 'src/store/actions/campaign'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
const MathmaniaQuestions = lazy(()=>import('src/components/Quiz/Mathmania/MathmaniaQuestions'))
import { t } from "src/utils";
import DOMPurify from 'dompurify'
import QuestionSkeleton from 'src/components/view/common/QuestionSkeleton'

const MathmaniaPlay = () => {

  const sysconfig = useSelector(sysConfigdata)

  const router = useRouter()

  const [questions, setQuestions] = useState([{ id: '', isBookmarked: false }])

  const TIMER_SECONDS = Number(sysconfig?.maths_quiz_seconds)

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.isSubcategory !== '0') {
      getNewQuestions('subcategory', router.query.subcatid)
    } else {
      getNewQuestions('category', router.query.catid)
    }

  }, [router.isReady]);



  const getNewQuestions = (type, type_id) => {
    getmathQuestionsApi({
      type: type,
      type_id: type_id,
      onSuccess: (response) => {
        let bookmark = getBookmarkData();
        let questions_ids = Object.keys(bookmark).map((index) => {
          return bookmark[index].question_id;
        });
        let questions = response.data.map((data) => {
          let isBookmark = false;
          if (questions_ids.indexOf(data.id) >= 0) {
            isBookmark = true;
          } else {
            isBookmark = false;
          }
          // let questionText = data.question ? data.question.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim() : "";

          // Use \n to represent line breaks in the data


          let question = data.question

          let note = data?.note


          return {
            ...data,

            note: note,
            question: question,
            isBookmarked: isBookmark,
            selected_answer: "",
            isAnswered: false,
          };
        });
        setQuestions(questions);
      },
      onError: (error) => {
        toast.error(t("no_que_found"));
        // navigate.push("/quiz-play");
        console.log(error);
      }
    });
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }



  return (
    <Layout>
      <Breadcrumb title={t('mathmania_play')} content="" contentTwo="" />
      <div className='funandlearnplay MathmaniaPlay dashboard'>
        <div className='container'>
          <div className='row '>
            <div className=''>
              <div className='whitebackground'>
                {(() => {
                  if (questions && questions?.length >= 0) {
                    return (
                      <Suspense fallback={<QuestionSkeleton/>}>
                      <MathmaniaQuestions
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
                        onOptionClick={handleAnswerOptionClick}
                        />
                        </Suspense>
                    )
                  } else {
                    return (
                      <div className='text-center text-white'>
                        <p>{t('no_que_found')}</p>
                      </div>
                    )
                  }
                })()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(MathmaniaPlay)
