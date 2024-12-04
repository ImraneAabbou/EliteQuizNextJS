"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import toast from "react-hot-toast";
import { withTranslation } from "react-i18next";
import { t } from "src/utils";

import { useSelector } from "react-redux";
import { subcategoriesApi } from "src/store/actions/campaign";
import { selectCurrentLanguage } from "src/store/reducers/languageSlice";
import Breadcrumb from "src/components/Common/Breadcrumb";
import { useRouter } from "next/router";

import dynamic from 'next/dynamic'
import { Loadtempdata } from "src/store/reducers/tempDataSlice";

import CatCompoSkeleton from "src/components/view/common/CatCompoSkeleton";
const Layout = dynamic(() => import('src/components/Layout/Layout'), { ssr: false })
const SubCategoriesComponent = lazy(() => import("src/components/view/common/SubCategoriesComponent"))

const AudioQuestions = () => {
  const [subCategory, setsubCategory] = useState([]);
  const selectcurrentLanguage = useSelector(selectCurrentLanguage);

  const router = useRouter();
  const cateSlug = router.query.subcategories;

  const getAllData = () => {
    if (cateSlug) {
      subcategoriesApi({
        category_id: cateSlug,
        subcategory_id: "",
        onSuccess: (response) => {

          let subcategories = response.data;
          if (!response.error && subcategories) {
            setsubCategory(subcategories);
          }
        },
        onError: (error) => {
          console.log(error);
          setsubCategory("");
          toast.error(t("no_subcat_data_found"));
        }
      });
    } else {
      toast.error(t("no_data_found"));
    }
  };

  //handle subcatgory
  const handleChangeSubCategory = (data) => {
    Loadtempdata(data)
    router.push({
      pathname: `/audio-questions/audio-questions-play`, query: {
        subcatid: data.id,
        is_play: data.is_play
      }
    })
  };



  useEffect(() => {
    if (!router.isReady) return;
    getAllData();
  }, [router.isReady, selectcurrentLanguage]);

  return (
    <Layout>

      <Breadcrumb showBreadcrumb={true} title={t("Audio Questions")} content={t("home")} contentTwo={subCategory[0]?.category_name} contentThree="" />
      <div className="quizplay mb-5">
        <div className="container">
          <div className="row morphisam mb-5">
            {/* sub category middle sec */}
            <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-12">
              <div className="right-sec">
                <div className="subcat__slider__context">
                  <div className="container">
                    <Suspense fallback={<CatCompoSkeleton />}>
                      <SubCategoriesComponent subCategory={subCategory} handleChangeSubCategory={handleChangeSubCategory} />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default withTranslation()(AudioQuestions);
