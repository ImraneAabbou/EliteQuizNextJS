"use client"
import React, { Suspense, useEffect, useState } from 'react'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {  sysConfigdata } from 'src/store/reducers/settingsSlice'
import { RandomQuestionsApi } from 'src/store/actions/campaign'
import { resultTempDataSuccess, selecttempdata } from 'src/store/reducers/tempDataSlice'
import { useRouter } from 'next/router'
import { groupbattledata } from 'src/store/reducers/groupbattleSlice'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { t } from "src/utils";
import QuestionSkeleton from 'src/components/view/common/QuestionSkeleton'
const RandomQuestions = dynamic(() => import('src/components/Quiz/RandomBattle/RandomQuestions'), {
  ssr: false
})

const RandomPlay = () => {

  const navigate = useRouter()

  let getData = useSelector(selecttempdata)

  const dispatch = useDispatch()

  const groupBattledata = useSelector(groupbattledata)

  let user2uid = groupBattledata?.user2uid

  const [questions, setQuestions] = useState([])

  const systemconfig = useSelector(sysConfigdata)

  const TIMER_SECONDS = Number(systemconfig?.battle_mode_random_in_seconds)

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.room_id, getData.category_id, getData.destroy_match)
    }
  }, [])

  const getNewQuestions = (match_id, category, destroy_match) => {
    if (systemconfig.battle_mode_random_category == "1") {
      RandomQuestionsApi({
        random: "",
        match_id: match_id,
        category: category,
        destroy_match: destroy_match,
        onSuccess: (response) => {
          let questions = response.data.map((data) => {

            let question = data?.question

            let note = data?.note

            return {
              ...data,
              note: note,
              question: question,
              selected_answer: "",
              isAnswered: false,
            };
          });
          setQuestions(questions);
        },
        onError: (error) => {
          toast.error(t("no_que_found"));
          navigate.push("/quiz-play");
          console.log(error);
        }
      });
    } else {
      RandomQuestionsApi({
        random: "",
        match_id: match_id,
        destroy_match: destroy_match,
        onSuccess: (response) => {
          let questions = response.data.map((data) => {

            let question = data?.question

            let note = data?.note

            return {
              ...data,
              note: note,
              question: question,
              selected_answer: "",
              isAnswered: false,
            };
          });
          setQuestions(questions);
        },
        onError: (error) => {
          toast.error(t("no_que_found"));
          navigate.push("/quiz-play");
          console.log(error);
        }
      });
    }
  };

  const handleAnswerOptionClick = (questions) => {
    setQuestions(questions)
  }

  const onQuestionEnd = async (coins, quizScore) => {
    const tempData = {
      totalQuestions: questions?.length,
      coins: user2uid !== "000" ? coins : null, //this condition is only for bot play 
      quizScore: quizScore,
    };

    // Dispatch the action with the data
    dispatch(resultTempDataSuccess(tempData));
    await navigate.push("/random-battle/result")
  }


  return (
    <Layout>
      <Breadcrumb title={t('1 v/s 1 Battle')} content="" contentTwo="" />
      <div className='funandlearnplay dashboard battlerandom'>
        <div className='container'>
          <div className='row '>
            <div className='morphisam'>
              <div className='whitebackground'>
                <>
                  {questions.length > 0 ? (
                    <Suspense fallback={<QuestionSkeleton />}>
                      <RandomQuestions
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
                        onOptionClick={handleAnswerOptionClick}
                        onQuestionEnd={onQuestionEnd}
                        showQuestions={true}
                      />
                    </Suspense>
                  ) : (
                    <div className='text-center text-white'>
                      {/* <p>{t('No Questions Found')}</p> */}
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default withTranslation()(RandomPlay)
