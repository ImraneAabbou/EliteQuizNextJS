import { createSelector, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { getLanguagesApi } from 'src/utils/api'
import { apiCallBegan } from '../actions/apiActions'
import { store } from '../store'

const initialState = {
  list: [],
  loading: false,
  lastFetch: null,
  currentLanguage: {
    id: null,
    code: null,
    name: null
  },
  languageJsonData:null,
  appLangList:null,
  currenApplang:null,
  rtl:0
}

export const slice = createSlice({
  name: 'Languages',
  initialState,
  reducers: {
    languagesRequested: (languages, action) => {
      languages.loading = true
    },
    languagesReceived: (languages, action) => {
      languages.list = action.payload.data
      languages.loading = false
      languages.lastFetch = Date.now()
    },
    languagesRequestFailed: (languages, action) => {
      languages.loading = false
    },
    languageChanged: (languages, action) => {
      languages.currentLanguage.code = action.payload.code
      languages.currentLanguage.name = action.payload.name
      languages.currentLanguage.id = action.payload.id
    },
    languageJson:(languages , action)=>{
      languages.languageJsonData = action.payload.data
    },
    appLanListData:(languages , action)=>{
      languages.appLangList = action.payload.data
    },
    currentAppLan:(languages, action)=>{
languages.currenApplang = action.payload
    },
    isRtl:(languages, action)=>{
languages.rtl = action.payload
    }
  }
})

export const { languagesRequested, languagesReceived, languagesRequestFailed, languageChanged,languageJson,appLanListData,currentAppLan,isRtl } =
  slice.actions
export default slice.reducer

// API Calls
export const loadLanguages = (id, onSuccess, onError, onStart,currentAppLan) => {
  // const {lastFetch} = store.getState().Languages;
  // const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
  // // If API data is fetched within last 10 minutes then don't call the API again
  // if (diffInMinutes < 10) return false;
  store.dispatch(
    apiCallBegan({
      ...getLanguagesApi(id),
      displayToast: false,
      onStartDispatch: languagesRequested.type,
      onSuccessDispatch: languagesReceived.type,
      onErrorDispatch: languagesRequestFailed.type,
      onStart,
      onSuccess,
      onError
    })
  )
}


export const setCurrentLanguage = (name, code, id) => {
  store.dispatch(languageChanged({ name, code, id }))
}

// Selector Functions
export const selectLanguages = createSelector(
  state => state.Languages,
  Languages => Languages.list
)

export const selectCurrentLanguage = createSelector(
  state => state.Languages.currentLanguage,
  Languages => Languages
)


export const languageJsonFile = createSelector(
  state => state.Languages,
  Languages =>Languages.languageJsonData

)
export const appLanList = createSelector(
  state => state.Languages,
  Languages =>Languages.appLangList
)
export const currentAppLanguage = createSelector(
  state => state.Languages,
  Languages=>Languages.currenApplang
)

export const rtlSupport = createSelector(
  state => state.Languages,
  Languages => Languages.rtl
)