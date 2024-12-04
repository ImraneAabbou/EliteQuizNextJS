import { Skeleton } from 'antd'
import React from 'react'

const QuestionSkeleton = () => {
  return (
    <>
      <div className='question_skeleton' >
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    </>
  )
}

export default QuestionSkeleton