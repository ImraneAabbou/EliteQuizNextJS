import React, { useState } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { decryptAnswer, handleBookmarkClick, imgError, reportQuestion } from 'src/utils'
import { useSelector } from 'react-redux'
import Bookmark from 'src/components/Common/Bookmark'
import { t } from "src/utils";
function AudioReviewAnswer({ questions, goBack, reportquestions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [disablePrev, setDisablePrev] = useState(true)
  const [disableNext, setDisableNext] = useState(false)

  // store data get
  const userData = useSelector(state => state.User)



  const previousQuestion = () => {
    const prevQuestion = currentQuestion - 1
    if (prevQuestion >= 0) {
      if (prevQuestion > 0) {
        setDisablePrev(false)
      } else {
        setDisablePrev(true)
      }
      setDisableNext(false)
      setCurrentQuestion(prevQuestion)
    }
  }

  const nextQuestion = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions?.length) {
      if (nextQuestion + 1 === questions?.length) {
        setDisableNext(true)
      } else {
        setDisableNext(false)
      }
      setDisablePrev(false)
      setCurrentQuestion(nextQuestion)
    }
  }

  const setAnswerStatusClass = option => {
    let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData?.data?.firebase_id)
    if (decryptedAnswer === option) {
      return 'bg-success'
    } else if (questions[currentQuestion].selected_answer === option) {
      return 'bg-danger'
    }
  }

  return (
    <React.Fragment>
      <div className='audio_review_upper_div'>
        <div className='text-center mt-2'>
          <h4 className=''>{t('review_answers')}</h4>
        </div>
        <div className='inner__headerdash audio_review_right_div flex-row ' style={{ width: '220px' }}>
          <div className='total__out__leveldata coinsdata mt-0'>
            <h5 className='inner__total-leveldata '>
              {currentQuestion + 1} | {questions?.length}
            </h5>
          </div>
          <div className="total__out__leveldata coinsdata ms-4 py-2 mt-0">
            <Bookmark
              id={questions[currentQuestion].id}
              onClick={handleBookmarkClick}
              type={'4'}
            />
          </div>
          {reportquestions ? (
            <div className='total__out__leveldata coinsdata ms-4 py-0 mt-0'>
              <button
                title='Report Question'
                className='btn bookmark_btn  '
                onClick={() => reportQuestion(questions[currentQuestion].id)}
              >
                <FaExclamationTriangle className='fa-2x' />
              </button>
            </div>
          ) : (
            false
          )}
        </div>
      </div>
      <div className='morphisam d-flex flex-wrap justify-content-center'>
      <div className='col-12 col-lg-8 content__text'>
        <p className='question-text mb-2'>{questions[currentQuestion].question}</p>

      {questions[currentQuestion].image ? (
        <div className='imagedash my-2'>
          <img src={questions[currentQuestion].image} onError={imgError} alt='' />
        </div>
      ) : (
        ''
      )}

      {/* Audio Questions Player */}
      <div className='audio_player text-center py-3'>
        <audio src={questions[currentQuestion].audio} controls autoPlay controlsList='nodownload noplaybackrate' />
      </div>

      </div>


      <div className='row optionsWrapper col-12 col-lg-4 '>
        {questions[currentQuestion].optiona ? (
          <div className='col-12 col-md-6 col-lg-12'>
            <div className='inner__questions'>
              <button className={`btn button__ui w-100 ${setAnswerStatusClass('a')}`}>
                {questions[currentQuestion].optiona}
              </button>
            </div>
          </div>
        ) : (
          ''
        )}
        {questions[currentQuestion].optionb ? (
          <div className='col-12 col-md-6 col-lg-12'>
            <div className='inner__questions'>
              <button className={`btn button__ui w-100 ${setAnswerStatusClass('b')}`}>
                {questions[currentQuestion].optionb}
              </button>
            </div>
          </div>
        ) : (
          ''
        )}
        {questions[currentQuestion].question_type === '1' ? (
          <>
            {questions[currentQuestion].optionc ? (
              <div className='col-12 col-md-6 col-lg-12'>
                <div className='inner__questions'>
                  <button className={`btn button__ui w-100 ${setAnswerStatusClass('c')}`}>
                    {questions[currentQuestion].optionc}
                  </button>
                </div>
              </div>
            ) : (
              ''
            )}
            {questions[currentQuestion].optiond ? (
              <div className='col-12 col-md-6 col-lg-12'>
                <div className='inner__questions'>
                  <button className={`btn button__ui w-100 ${setAnswerStatusClass('d')}`}>
                    {questions[currentQuestion].optiond}
                  </button>
                </div>
              </div>
            ) : (
              ''
            )}
            {questions[currentQuestion].optione !== "" ? (
              <div className='row d-flex justify-content-center'>
                <div className='col-12 col-md-6 col-lg-12'>
                  <div className='inner__questions'>
                    <button className={`btn button__ui w-100 ${setAnswerStatusClass('e')}`}>
                      <div className='row'>
                        <div className='col'>{questions[currentQuestion].optione}</div>
                        {questions[currentQuestion].probability_e ? (
                          <div className='col text-end'>{questions[currentQuestion].probability_e}</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
        {!questions[currentQuestion].selected_answer ? (
          <div className='text-end'>
            <span className=''>*{t('not_att')}</span>
          </div>
        ) : (
          ''
        )}
      </div>
      </div>
      <div className='dashoptions'>
        <div className='fifty__fifty'>
          <button className='btn btn-primary' onClick={previousQuestion} disabled={disablePrev}>
            &lt;
          </button>
        </div>
        <div className='resettimer'>
          <button className='btn btn-primary' onClick={goBack}>
            {t('back')}
          </button>
        </div>
        <div className='skip__questions'>
          <button className='btn btn-primary' onClick={nextQuestion} disabled={disableNext}>
            &gt;
          </button>
        </div>
      </div>
      <div className='text-center '>
        <small>
          {questions[currentQuestion].note ? <p>{t('note') + ' : ' + questions[currentQuestion].note}</p> : ''}
        </small>
      </div>
    </React.Fragment>
  )
}

AudioReviewAnswer.propTypes = {
  questions: PropTypes.array.isRequired,
  goBack: PropTypes.func
}

export default withTranslation()(AudioReviewAnswer)
