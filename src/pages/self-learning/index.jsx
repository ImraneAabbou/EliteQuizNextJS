'use client'
import React, { useState, useEffect, Suspense, lazy } from 'react'
import toast from 'react-hot-toast'
import { withTranslation } from 'react-i18next'
import { isValidSlug, scrollhandler } from 'src/utils'
import { t } from "src/utils";
import { useDispatch, useSelector } from 'react-redux'
import {
    UserCoinScoreApi,
    categoriesApi,
    getusercoinsApi,
    unlockpremiumcateApi
} from 'src/store/actions/campaign'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { updateUserDataInfo } from 'src/store/reducers/userSlice'
const MySwal = withReactContent(Swal)
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
import { Loadtempdata, reviewAnswerShowSuccess } from 'src/store/reducers/tempDataSlice'
import CatCompoSkeleton from 'src/components/view/common/CatCompoSkeleton'
const CategoriesComponent = lazy(() => import('src/components/view/common/CategoriesComponent'))
const SelfLearning = () => {
    const dispatch = useDispatch()
    const [category, setCategory] = useState({ all: '', selected: '' })
    const selectcurrentLanguage = useSelector(selectCurrentLanguage)
    const router = useRouter();
    const getAllData = () => {
        setCategory([])

        // categories api
        categoriesApi({
            type: 1,
            sub_type: 1,
            onSuccess: response => {
                let categories = response.data
                // Filter the categories based on has_unlocked and is_premium
                // const filteredCategories = categories.filter((category) => {
                //     return category?.is_premium === "0";
                // });
                setCategory({
                    ...category,
                    all: categories,
                });

            },
            onError: error => {
                setCategory("")
                toast.error(t('no_data_found'))
            }
        })
    }

    //handle category
    const handleChangeCategory = data => {
        // this is for premium category only
        if (data.has_unlocked === '0' && data.is_premium === '1') {
            getusercoinsApi({
                onSuccess: res => {
                    if (Number(data.coins) > Number(res.data.coins)) {
                        MySwal.fire({
                            text: t("no_enough_coins"),
                            icon: 'warning',
                            showCancelButton: false,
                            customClass: {
                                confirmButton: 'Swal-confirm-buttons',
                                cancelButton: "Swal-cancel-buttons"
                            },
                            confirmButtonText: `OK`,
                            allowOutsideClick: false
                        })
                    } else {
                        MySwal.fire({
                            text: t('double_coins_achieve_higher_score'),
                            icon: 'warning',
                            showCancelButton: true,
                            customClass: {
                                confirmButton: 'Swal-confirm-buttons',
                                cancelButton: "Swal-cancel-buttons"
                            },
                            confirmButtonText: `use ${data.coins} coins`,
                            allowOutsideClick: false
                        }).then(result => {
                            if (result.isConfirmed) {
                                unlockpremiumcateApi({
                                    cat_id: data.id,
                                    onSuccess: res => {
                                        getAllData()
                                        UserCoinScoreApi({
                                            coins: '-' + data.coins,
                                            title: `${t('Self Challenge')} ${t('Premium')} ${t('Categories')}`,
                                            status: '1',
                                            onSuccess: response => {
                                                getusercoinsApi({
                                                    onSuccess: responseData => {
                                                        updateUserDataInfo(responseData.data)
                                                    },
                                                    onError: error => {
                                                        console.log(error)
                                                    }
                                                })
                                            },
                                            onError: error => {
                                                console.log(error)
                                            }
                                        })
                                    },
                                    onError: err => console.log(err)
                                })
                            }
                        })
                    }
                },
                onError: err => {
                    console.log(err)
                }
            })

        } else {
            if (data.no_of !== '0') {
                const slug = data.slug;
                if (isValidSlug(slug)) {
                    router.push({
                        pathname: `/self-learning/sub-categories/${data.slug}`
                    })
                }
            } else {
                Loadtempdata(data)
                const slug = data.slug;
                if (isValidSlug(slug)) {
                    router.push({
                        pathname: `/self-learning/selection/${data.slug}`, query: {
                            catslug: data.slug,
                            isSubcategory: 0,
                            is_play: data?.is_play
                        }
                    })
                }

            }
        }
        //mobile device scroll handle
        scrollhandler(500)
    }

    //truncate text
    const truncate = txtlength => (txtlength?.length > 17 ? `${txtlength.substring(0, 17)}...` : txtlength)

    useEffect(() => {
        getAllData()
        dispatch(reviewAnswerShowSuccess(false))
    }, [selectcurrentLanguage])

    return (
        <Layout>
            <Breadcrumb showBreadcrumb={true} title={t('Self Challenge')} content={t('home')} allgames={`${t('quiz')} ${t('play')}`} contentTwo="" />
            <div className='quizplay mb-5'>
                <div className='container'>
                    <div className='row morphisam mb-5'>
                        <div className='col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-12'>
                            <div className='left-sec'>
                                {/* left category sec*/}
                                <div className='bottom__left'>
                                    <div className='bottom__cat__box'>
                                        <ul className='inner__Cat__box'>
                                            <Suspense fallback={<CatCompoSkeleton />}>
                                                <CategoriesComponent category={category} handleChangeCategory={handleChangeCategory} />
                                            </Suspense>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    )
}
export default withTranslation()(SelfLearning)
