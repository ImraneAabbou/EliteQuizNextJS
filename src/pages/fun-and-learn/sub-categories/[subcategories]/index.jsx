"use client"
import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import {subcategoriesApi}
 from 'src/store/actions/campaign'
import Breadcrumb from 'src/components/Common/Breadcrumb'
import FunandLearnSubCatSlider from 'src/components/Quiz/Fun_and_Learn/FunandLearnSubCatSlider'
import { selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { t } from "src/utils";

import { isValidSlug } from 'src/utils'
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })


const Fun_and_Learn = () => {

    const [subCategory, setsubCategory] = useState({ all: '', selected: '' })

    const [subloading, setSubLoading] = useState(true)

    const router = useRouter();

    const cateSlug = router.query.subcategories;

    const getAllData = () => {
        setsubCategory([])
        if (cateSlug) {
            // subcategory api
            subcategoriesApi({
                category_id: cateSlug,
                subcategory_id: '',
                onSuccess: response => {
                    let subcategories = response.data
                    setsubCategory({
                        all: subcategories,
                        selected: subcategories[0]
                    })
                    setSubLoading(false)
                },
                onError: error => {
                    console.log(error)
                    setSubLoading(false)
                }
            })
        }


    }

    //handle subcatgory
    const handleChangeSubCategory = subcategory_data => {
        // this is for premium subcategory only
        const slug = subcategory_data.slug;
        if (isValidSlug(slug)) {
            router.push({
                pathname: `/fun-and-learn/fun-data/${subcategory_data.slug}`, query: {
                    catid: subcategory_data.id,
                    subcatid: subcategory_data.id,
                    isSubcategory: 1
                }
            })
        }

    }

    useEffect(() => {
        if (!router.isReady) return;
        getAllData();
    }, [router.isReady, selectCurrentLanguage]);

    return (
        <Layout>
            <Breadcrumb showBreadcrumb={true} title={t('fun_and_learn')} content={t("home")} contentTwo={subCategory?.selected?.category_name} contentThree="" />
            <div className='funandlearn mb-5'>
                <div className='container'>
                    <div className='row morphisam mb-5'>
                        {/* sub category middle sec */}
                        <div className='col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-12'>
                            <div className='right-sec'>
                                <FunandLearnSubCatSlider
                                    data={subCategory?.all}
                                    selected={subCategory.selected}
                                    onClick={handleChangeSubCategory}
                                    subloading={subloading}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default withTranslation()(Fun_and_Learn)
