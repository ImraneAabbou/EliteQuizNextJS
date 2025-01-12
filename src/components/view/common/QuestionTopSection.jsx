import { t } from "i18next"
import { useSelector } from "react-redux"
import rightTickIcon from 'src/assets/images/check-circle-score-screen.svg'
import crossIcon from 'src/assets/images/x-circle-score-screen.svg'
import Bookmark from "src/components/Common/Bookmark"

const QuestionTopSection = ({ corrAns, inCorrAns, currentQuestion, questions, showAnswers }) => {

    const userData = useSelector(state => state.User)

    return (
        <>
            <div className="leftSec">
                <div className="coins">
                    <span>{t("coins")} : {userData?.data?.coins}</span>
                </div>

                {showAnswers ?
                    <div className="rightWrongAnsDiv">
                        <span className='rightAns'>
                            <img src={rightTickIcon.src} alt="" />
                            {corrAns}
                        </span>

                        <span className='wrongAns'>
                            <img src={crossIcon.src} alt="" />
                            {inCorrAns}
                        </span>
                    </div>
                    : null}

            </div>
            <div className={`rightSec ${!showAnswers && 'right_section_inner_data'}`}>
                <div className="rightWrongAnsDiv correctIncorrect  adj_total_q_btn">
                    <span className='rightAns'>
                        {currentQuestion + 1} - {questions?.length}</span>
                </div>
            </div>
        </>
    )
}

export default QuestionTopSection