'use client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { websettingsData } from 'src/store/reducers/webSettings'
import { settingsLoaded, sysConfigdata, systemconfigApi } from "src/store/reducers/settingsSlice";
import { useDispatch, useSelector } from 'react-redux'
import {  selectCurrentLanguage } from 'src/store/reducers/languageSlice'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Meta from '../SEO/Meta';
import { homeUpdateLanguage, loadHome } from 'src/store/reducers/homeSlice';
const TopHeader = dynamic(() => import('../NavBar/TopHeader'), { ssr: false })
const Header = dynamic(() => import('./Header'), { ssr: false })
const Footer = dynamic(() => import('./Footer'), { ssr: false })

// const Notification = dynamic(() => import('../FirebaseNotification/Notification'), { ssr: false })

const Layout = ({ children }) => {

  const { i18n } = useTranslation()

  const navigate = useRouter()

  const [redirect, setRedirect] = useState(false)

  const selectcurrentLanguage = useSelector(selectCurrentLanguage)

  const appLngCode = useSelector(state => state.Languages.appLngCode)

  const webSettings = useSelector(websettingsData)



  const dispatch = useDispatch();

  useEffect(() => {
    loadHome({
      onSuccess: response => {
        dispatch(homeUpdateLanguage(selectcurrentLanguage.id))
      },
      onError: error => {
        dispatch(homeUpdateLanguage(""))
        console.log(error)
      }
    })

  }, [selectcurrentLanguage])

  // all settings data
  useEffect(() => {

    settingsLoaded({ type: "" })

    systemconfigApi({
      onSuccess: () => { },
      onError: (error) => {
        console.log(error)
      }
    })

    // {
    //   appLngCode !== undefined && i18n.changeLanguage(appLngCode)
    // }
  }, [])



  // Maintainance Mode
  const getsysData = useSelector(sysConfigdata)

  useEffect(() => {
    if (getsysData && getsysData.app_maintenance === '1') {
      setRedirect(true)
    } else {
      setRedirect(false)
    }
  }, [getsysData?.app_maintenance])

  // Function to handle navigation to maintenance page
  const handleMaintenanceRedirect = () => {
    navigate.push('/maintenance')
  }

  useEffect(() => {
    if (redirect) {
      handleMaintenanceRedirect() // Trigger the navigation outside the JSX
    }
  }, [redirect])

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', webSettings && webSettings?.primary_color ? webSettings && webSettings?.primary_color : "#EF5388FF")
    document.documentElement.style.setProperty('--secondary-color', webSettings && webSettings?.footer_color ? webSettings?.footer_color : "#090029FF")
  }, [webSettings])


  return (
    <>

      <Meta />
      <TopHeader />
      <Header />
      {children}
      <Footer />

    </>
  )
}
export default Layout
