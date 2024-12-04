import React from 'react'
import { withTranslation } from 'react-i18next'
import Meta from 'src/components/SEO/Meta'
import ContactUs from 'src/components/Static-Pages/ContactUs'
import { t } from "src/utils";


const Contact_us = () => {

  return (
    <React.Fragment>
      <Meta />
      <ContactUs />
    </React.Fragment>
  )
}
export default withTranslation()(Contact_us)
