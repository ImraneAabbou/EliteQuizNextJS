'use client'
import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd'
import { FaRegBell } from 'react-icons/fa'
import { withTranslation, useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip } from 'react-tooltip'
import { IoExitOutline } from 'react-icons/io5'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  appLanList,
  appLanListData,
  currentAppLan,
  currentAppLanguage,
  isRtl,
  languageJson,
  languageJsonFile,
  loadLanguages,
  rtlSupport,
  selectCurrentLanguage,
  selectLanguages,
  setCurrentLanguage
} from 'src/store/reducers/languageSlice'
import { sysConfigdata } from 'src/store/reducers/settingsSlice'
import FirebaseData from 'src/utils/Firebase'
import { imgError, isLogin } from 'src/utils'
import { logout } from 'src/store/reducers/userSlice'
import img6 from "../../../public/images/profileimages/6.svg"
import warningImg from '../../assets/images/logout.svg'
import noNotificationImg from '../../assets/images/notification.svg'
import { loadNotification, notifiationTotal, notificationData, updateTotal } from 'src/store/reducers/notificationSlice'
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { signOut } from 'firebase/auth'
import userImg from '../../assets/images/user.svg'
import { getsystemLanguageJson, getsystemLanguageListApi } from 'src/store/actions/campaign'
import { t } from "src/utils";
import { updateI18nTranslations } from 'src/utils/language'


const MySwal = withReactContent(Swal)

const TopHeader = () => {

  const dispatch = useDispatch()

  const { auth } = FirebaseData()

  const router = useRouter()

  const { i18n } = useTranslation()

  const languages = useSelector(selectLanguages)

  const selectcurrentLanguage = useSelector(selectCurrentLanguage)

  // store data get


  const userData = useSelector(state => state.User)

  const notification = useSelector(notificationData)

  const notificationtotal = useSelector(notifiationTotal)

  const systemconfig = useSelector(sysConfigdata)

  const languageJsondata = useSelector(languageJsonFile)

  const appLanguageList = useSelector(appLanList)

  const currAppLan = useSelector(currentAppLanguage)

  const isrtl = useSelector(rtlSupport)

  //notification
  const [notificationmodal, setNotificationModal] = useState(false)

  const [logoutModal, setLogoutModal] = useState(false)

  const [guestlogout, setGuestLogout] = useState(false)

  // App language change
  const appLanguageChange = async (name) => {
    dispatch(currentAppLan(name))
    getsystemLanguageJson({
      language: name,
      onSuccess: response => {
        dispatch(languageJson(response));
        dispatch(isRtl(response.rtl_support));
        updateI18nTranslations(response.data);
      }
    })
  }
  // language change
  const languageChange = async (name, code, id) => {
    setCurrentLanguage(name, code, id)
    // await i18n.changeLanguage(code)
  }

  // if APP language change and if it rtl supported then rtl else ltr 
  useEffect(() => {
    if (isrtl && isrtl === "1") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [isrtl]);

  //api render
  useEffect(() => {
    if (router.pathname === "/" || router.pathname === "/quiz-play") {
      loadLanguages(
        '',
        response => {
          if (selectcurrentLanguage.code == null) {
            let index = response?.data?.filter(data => {
              if (response?.data?.length == 1) {
                return { code: data.code, name: data.name, id: data.id }
              }else if(data.code == "en") {
                return { code: data.code, name: data.name, id: data.id }
              }
            })
            setCurrentLanguage(index[0].language, index[0].code, index[0].id)
          }
        },
        error => {
          if (error === "102") {
            setCurrentLanguage("English (US)", "en", "14")
          }
        }
      )
    }
  }, [router, selectcurrentLanguage])

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (isLogin()) {
      if (router.pathname === "/" || router.pathname === "/quiz-play") {
        loadNotification({
          order: "DESC", offset: offset, limit: limit, onSuccess: (res) => {
            let response = res.total
            dispatch(updateTotal(response))
          }, onError: (error) => {
            if (error === "102") {
              dispatch(updateTotal(0))
            }
            console.log(error)
          }
        })
      }
    }
  }, [limit])



  // sign out
  const handleSignout = () => {
    setLogoutModal(true)

  }

  const handleConfirmLogout = () => {
    logout()
    signOut(auth)
    router.push('/')
    setLogoutModal(false)
  }

  // check user data for username
  let userName = ''

  const checkUserData = userData => {
    if (userData?.data && userData?.data?.name != '') {
      return (userName = userData?.data?.name)
    } else if (userData?.data && userData?.data?.email != '') {
      return (userName = userData?.data?.email)
    } else {
      return (userName = userData?.data?.mobile)
    }
  }

  // guest logout
  const guestLogout = e => {
    e.preventDefault()
    setGuestLogout(true)
    router.push('/auth/login')
  }

  // profile image logout
  const profileGuest = e => {
    e.preventDefault()
    MySwal.fire({
      text: t('login_first'),
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: t('cancel'),
      customClass: {
        confirmButton: 'Swal-confirm-buttons',
        cancelButton: "Swal-cancel-buttons"
      },
      confirmButtonText: t("login"),
      allowOutsideClick: false
    }).then(result => {
      if (result.isConfirmed) {
        guestLogout(e)
      }
    })
  }

  // notification tooltip leave on mouse
  const handleMouseLeave = () => {
    const tooltipElement = document.querySelector('[data-tooltip-id="custom-my-tooltip"]')
    if (tooltipElement) {
      tooltipElement.removeAttribute('data-tooltip-content')
    }
  }

  // notification tooltip enter on mouse
  const handleMouserEnter = () => {
    const tooltipElement = document.querySelector('[data-tooltip-id="custom-my-tooltip"]')
    if (tooltipElement) {
      tooltipElement.setAttribute('data-tooltip-content', `${t('notification')}`)
    }
  }

  useEffect(() => {

    const firstLoad = sessionStorage.getItem('firstLoad_App_Language')
    const manualRefresh = sessionStorage.getItem('manualRefresh_App_Language')
    const shouldFetchData = !firstLoad || manualRefresh === 'true'

    if (shouldFetchData || languageJsondata == null) {

      let defaultLang = null
      getsystemLanguageListApi({
        onSuccess: response => {
          response.data.filter((lan) => {
            if (lan.web_default == 1) {
              defaultLang = lan.name
            }
          })
          sessionStorage.setItem('firstLoad_App_Language', 'true')
          dispatch(appLanListData(response))
          dispatch(currentAppLan(defaultLang)) 
          
          getsystemLanguageJson({
            language: defaultLang,
            onSuccess: response => {
              sessionStorage.setItem('lastFetch_App_language', 'true')

              dispatch(languageJson(response))
              updateI18nTranslations(response.data)
            }
          })
        }
      })
    }
    sessionStorage.removeItem('manualRefresh_App_Language')
    sessionStorage.setItem('firstLoad_App_Language', 'true')


  }, [])

  // Event listener to set manualRefresh flag when page is manually refreshed
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('manualRefresh_App_Language', 'true')
    })

    window.addEventListener('load', () => {
      // Check if this is a manual refresh by checking if lastFetch is set
      if (!sessionStorage.getItem('lastFetch_App_language')) {
        sessionStorage.setItem('manualRefresh_App_Language', 'true')
      }
    })
  }

  const appMenu = (
    <Menu>
      {appLanguageList && appLanguageList.map((data) => (
        <Menu.Item key={data.name} onClick={() => appLanguageChange(data.name, data.title)}>
          {data.title}
        </Menu.Item>
      ))}
    </Menu>
  );
  const menu = (
    <Menu>
      {languages && languages.map((data) => (
        <Menu.Item key={data.id} onClick={() => languageChange(data.language, data.code, data.id)}>
          {data.language}
        </Menu.Item>
      ))}
    </Menu>
  );

  const profileMenu = (
    <Menu>
      <Menu.Item onClick={() => router.push('/profile')}>
        {t('profile')}
      </Menu.Item>
      <Menu.Item onClick={handleSignout}>
        {t('logout')}
      </Menu.Item>
    </Menu>
  );

  const handleMoreNotifications = (e) => {
    e.preventDefault()
    setOffset((prevOffset) => prevOffset + limit);
    setLimit((prevLimit) => prevLimit + 10);

  }
  
  return (
    <React.Fragment>
      <div className='small__top__header'>
        <div className="container">
          <div className='row justify-content-between align-items-center'>
            <div className='col-md-6 col-12'>
              {(router.pathname === "/" || router.pathname === "/quiz-play") && !((appLanguageList && appLanguageList.length === 1) && (languages && languages.length === 1)) ? (
                <div className='d-flex'>
                  {appLanguageList && appLanguageList.length !== 1 && <div className='dropdown__language '>
                    <p>{t('web')} :</p> <Dropdown trigger={['hover']} overlay={appMenu} >
                      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                        {currAppLan ? currAppLan : t('language')}
                        <DownOutlined />
                      </a>
                    </Dropdown>
                  </div>}
                  {systemconfig && systemconfig.language_mode === '1' && (languages && languages.length > 1) &&
                    <div className='dropdown__language mx-3'>
                      <p>{t('quiz_language')} :</p><Dropdown trigger={['hover']} overlay={menu} >
                        <a className="ant-dropdown-link " onClick={(e) => e.preventDefault()}>
                          {selectcurrentLanguage && selectcurrentLanguage.name
                            ? selectcurrentLanguage.name
                            : t('language')}
                          <DownOutlined />
                        </a>
                      </Dropdown>
                    </div>}
                </div>
              ) : (
                ''
              )}
            </div>

            <div className='col-md-6 col-12'>
              <div className='top_header_right'>
                <div className='login__sign__form'>
                  {isLogin() && checkUserData(userData) ? (
                    <Dropdown trigger={['hover']} overlay={profileMenu} >
                      <a className="dropdown__login profile_dropdown" onClick={(e) => e.preventDefault()}>
                        {`${t('hello')} ${userName}`}
                        <DownOutlined />
                      </a>
                    </Dropdown>
                  ) : (
                    <div>
                      {!guestlogout ? (
                        <div className='right_guest_profile'>
                          <img
                            className='profile_image'
                            onClick={e => profileGuest(e)}
                            src={img6.src}
                            alt='profile'
                          />
                          <button id='dropdown-basic-button' className='btn btn-primary dropdown__login'>{`${t('hello_guest')}`}</button>
                          <button className='btn btn-primary custom_button_right ms-2' onClick={e => guestLogout(e)}>
                            <IoExitOutline />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span>
                            <Link href='/auth/login' className='login'>
                              {t('login')}
                            </Link>
                          </span>
                          <span>
                            <Link href='/auth/sign-up' className='signup'>
                              {t('sign_up')}
                            </Link>
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className='notification'>
                  {isLogin() ? (
                    <Button
                      className='notify_btn btn-primary'
                      onClick={() => setNotificationModal(true)}
                      onMouseEnter={handleMouserEnter}
                      onMouseLeave={handleMouseLeave}
                      data-tooltip-id='custom-my-tooltip'
                    >
                      <span className='notification_badges'>{notification ? notification?.data?.length : '0'}</span>
                      <FaRegBell />
                    </Button>
                  ) : (
                    ''
                  )}
                  <Modal
                    title={t('notification')}
                    width={800}
                    centered
                    open={notificationmodal}
                    onOk={() => setNotificationModal(false)}
                    onCancel={() => setNotificationModal(false)}
                    footer={null}
                    className='custom_modal_notify notification'
                  >
                    {notification?.data?.length ? (
                      notification?.data.map((data, key) => {
                        return (
                          <div key={key} className='outer_noti'>
                            <img
                              className='noti_image'
                              src={data?.image ? data?.image : userImg.src}
                              alt='notication'
                              id='image'
                              onError={imgError}
                            />
                            <div className='noti_desc'>
                              <p className='noti_title'>{data?.title}</p>
                              <p>{data?.message}</p>
                              <span>{data?.date_sent}</span>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="noDataDiv">
                        <img src={noNotificationImg.src} alt="" />
                        {/* <h5 className='text-center text-black-50'>
                        {t('no_data_found')}</h5> */}
                      </div>
                    )}
                    {notificationtotal && notificationtotal > 10 ? (
                      <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={(e) => handleMoreNotifications(e)}>
                          {t("more")}
                        </button>
                      </div>
                    ) : null}
                  </Modal>
                </div>
                {/* <div className="darkmode ps-2">
                  <ThemeToggle />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tooltip id='custom-my-tooltip' />
      <Modal
        maskClosable={false}
        centered
        open={logoutModal}
        onOk={() => setLogoutModal(false)}
        onCancel={() => {
          setLogoutModal(false)
        }}
        footer={null}
        className='logoutModal'
      >
        <div className="logoutWrapper">
          <span><img src={warningImg.src} alt="" /></span>
          <span className='headline'>{t("logout")}</span>
          <span className='confirmMsg'>{t("sure_logout")}</span>
        </div>

        <div className="logoutBtns">
          <span className='yes' onClick={handleConfirmLogout}>{t("yes_logout")}</span>
          <span className='no' onClick={() => setLogoutModal(false)}>{t("keep_login")}</span>
        </div>
      </Modal>
    </React.Fragment>
  )
}
export default withTranslation()(TopHeader)
