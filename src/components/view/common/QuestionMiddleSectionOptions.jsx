import ProgressBar from 'react-bootstrap/ProgressBar';
import { useSelector } from 'react-redux';
import { sysConfigdata } from 'src/store/reducers/settingsSlice';
import { RenderHtmlContent, imgError, t, useOverflowRefs } from "src/utils"


const QuestionMiddleSectionOptions = ({ questions, currentQuestion, setAnswerStatusClass, handleAnswerOptionClick, probability, latex, math, exam_latex }) => {
    const { buttonRefA, buttonRefB, buttonRefC, buttonRefD, buttonRefE } = useOverflowRefs(questions, currentQuestion);

    // condition for latex and exam latex 
    const systemconfig = useSelector(sysConfigdata)
    const Latex = systemconfig.latex_mode === "1" ? true : false
    const condition = exam_latex == undefined ? (Latex || math) : exam_latex


    return (
        <>
            <div className='row morphisam mb-4'>
                <div className='col-12 col-lg-8 content__text'>
                    
                        <p className='question-text'>{condition ? <RenderHtmlContent htmlContent={questions[currentQuestion]?.question} />
                            : questions[currentQuestion]?.question}</p>

                            {questions[currentQuestion]?.image ? (
                    <div className='col-12 col-lg-8  imagedash'>
                        <img src={questions[currentQuestion].image} onError={imgError} alt='' />
                    </div>
                ) : (
                    ''
                )}
                    
                </div>

                

                {/* options */}
                <div className='col-12 col-lg-4 '>
                    <div className='row optionsWrapper'>
                        {questions[currentQuestion].optiona ? (
                            <div className='col-12 col-md-6 col-lg-12'>
                                <div className='inner__questions'>
                                    <button
                                        ref={buttonRefA}
                                        className={`btn button__ui w-100 ${setAnswerStatusClass('a')}`}
                                        onClick={e => handleAnswerOptionClick('a')}
                                    >
                                        <div className='row'>
                                            <div className='col optionBtn'>
                                                <span className='optionIndex'>{t('a')}&nbsp;</span> {condition ?
                                                    <RenderHtmlContent htmlContent={questions[currentQuestion]?.optiona} />
                                                    :
                                                    questions[currentQuestion].optiona
                                                }
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                {probability ?
                                    <>
                                        {questions[currentQuestion].probability_a ? (
                                            <div className='col text-end audiencePollDiv'>{questions[currentQuestion].probability_a}
                                                <div className="progressBarWrapper">
                                                    <ProgressBar now={questions[currentQuestion].probability_a.replace('%', '')} visuallyHidden />;
                                                </div></div>
                                        ) : (
                                            ''
                                        )}
                                    </>
                                    : null}
                            </div>
                        ) : (
                            ''
                        )}
                        {questions[currentQuestion].optionb ? (
                            <div className='col-12 col-md-6 col-lg-12'>
                                <div className='inner__questions'>
                                    <button
                                        ref={buttonRefB}
                                        className={`btn button__ui w-100 ${setAnswerStatusClass('b')}`}
                                        onClick={e => handleAnswerOptionClick('b')}
                                    >
                                        <div className='row'>
                                            <div className='col optionBtn'>
                                            <span className='optionIndex'>{t('b')}&nbsp;</span> {condition ?
                                                    <RenderHtmlContent htmlContent={questions[currentQuestion]?.optionb} />
                                                    :
                                                    questions[currentQuestion].optionb
                                                }
                                            </div>

                                        </div>
                                    </button>

                                </div>
                                {probability ?
                                    <>
                                        {questions[currentQuestion].probability_b ? (
                                            <div className='col text-end audiencePollDiv'>{questions[currentQuestion].probability_b}
                                                <div className="progressBarWrapper">
                                                    <ProgressBar now={questions[currentQuestion].probability_b.replace('%', '')} visuallyHidden />;
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </>
                                    : null}
                            </div>
                        ) : (
                            ''
                        )}
                        {questions[currentQuestion].question_type === '1' ? (
                            <>
                                {questions[currentQuestion].optionc ? (
                                    <div className='col-12 col-md-6 col-lg-12'>
                                        <div className='inner__questions'>
                                            <button
                                                ref={buttonRefC}
                                                className={`btn button__ui w-100 ${setAnswerStatusClass('c')}`}
                                                onClick={e => handleAnswerOptionClick('c')}
                                            >
                                                <div className='row'>
                                                    <div className='col optionBtn'>
                                                    <span className='optionIndex'>{t('c')}&nbsp;</span>  {condition ?
                                                            <RenderHtmlContent htmlContent={questions[currentQuestion]?.optionc} />
                                                            :
                                                            questions[currentQuestion].optionc
                                                        }
                                                    </div>

                                                </div>
                                            </button>
                                        </div>
                                        {probability ?
                                            <>
                                                {questions[currentQuestion].probability_c ? (
                                                    <div className='col text-end audiencePollDiv'>{questions[currentQuestion].probability_c}
                                                        <div className="progressBarWrapper">
                                                            <ProgressBar now={questions[currentQuestion].probability_c.replace('%', '')} visuallyHidden />;
                                                        </div></div>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                            : null}
                                    </div>
                                ) : (
                                    ''
                                )}
                                {questions[currentQuestion].optiond ? (
                                    <div className='col-12 col-md-6 col-lg-12'>
                                        <div className='inner__questions'>
                                            <button
                                                ref={buttonRefD}
                                                className={`btn button__ui w-100 ${setAnswerStatusClass('d')}`}
                                                onClick={e => handleAnswerOptionClick('d')}
                                            >
                                                <div className='row'>
                                                    <div className='col optionBtn'>
                                                    <span className='optionIndex'>{t('d')}&nbsp;</span>  {condition ?
                                                            <RenderHtmlContent htmlContent={questions[currentQuestion]?.optiond} />
                                                            :
                                                            questions[currentQuestion].optiond
                                                        }
                                                    </div>

                                                </div>
                                            </button>

                                        </div>
                                        {probability ?
                                            <>
                                                {questions[currentQuestion].probability_d ? (
                                                    <div className='col text-end audiencePollDiv'>{questions[currentQuestion].probability_d}
                                                        <div className="progressBarWrapper">
                                                            <ProgressBar now={questions[currentQuestion].probability_d.replace('%', '')} visuallyHidden />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </>
                                            : null}
                                    </div>
                                ) : (
                                    ''
                                )}

                                {questions[currentQuestion].optione !== "" ? (
                                    <div className='row d-flex justify-content-center mob_resp_e'>
                                        <div className='col-12 col-md-6 col-lg-12'>
                                            <div className='inner__questions'>
                                                <button
                                                    ref={buttonRefE}
                                                    className={`btn button__ui w-100 ${setAnswerStatusClass('e')}`}
                                                    onClick={e => handleAnswerOptionClick('e')}
                                                >
                                                    <div className='row'>
                                                        <div className='col optionBtn'>
                                                        <span className='optionIndex'>{t('e')}&nbsp;</span>  {condition ?
                                                                <RenderHtmlContent htmlContent={questions[currentQuestion]?.optione} />
                                                                :
                                                                questions[currentQuestion].optione
                                                            }
                                                        </div>

                                                    </div>
                                                </button>
                                            </div>
                                            {probability ?
                                                <>
                                                    {questions[currentQuestion].probability_e ? (
                                                        <div className='col text-end audiencePollDiv'>{questions[currentQuestion].probability_e}
                                                            <div className="progressBarWrapper">
                                                                <ProgressBar now={questions[currentQuestion].probability_e.replace('%', '')} visuallyHidden />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        ''
                                                    )}
                                                </>
                                                : null}
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionMiddleSectionOptions