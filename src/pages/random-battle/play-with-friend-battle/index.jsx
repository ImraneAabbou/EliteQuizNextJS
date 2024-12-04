import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import QuestionSkeleton from 'src/components/view/common/QuestionSkeleton'
const PlayWithFriendBattle = dynamic(() => import('src/components/Quiz/RandomBattle/PlayWithFriendBattle'), { ssr: false })
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })

const Index = () => {
  return (
    <Layout><Suspense fallback={<QuestionSkeleton />}><PlayWithFriendBattle /></Suspense></Layout>
  )
}

export default Index