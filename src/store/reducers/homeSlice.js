import { createSelector, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { getHomeWebSettingsApi } from 'src/utils/api'
import { apiCallBegan } from '../actions/apiActions'
import { store } from '../store'

const initialState = {
  data: {},
  loading: false,
  lastFetch: null,
  Lang: null
}

export const slice = createSlice({
  name: 'Home',
  initialState,
  reducers: {
    homeRequested: home => {
      home.loading = true
    },
    homeReceived: (home, action) => {
      home.data = action.payload.data
      home.loading = false
      home.lastFetch = Date.now()
      home.Lang = action.request
    },
    homeRequestFailed: (home, action) => {
      home.data = action.payload
      home.loading = true
    },
    homeUpdateLanguage: (home, action) => {
      if (home.Lang) {
        home.Lang.language_id = action.payload
      }
    }
  }
})

export const { homeRequested, homeReceived, homeRequestFailed, homeUpdateLanguage } = slice.actions
export default slice.reducer

// API Calls
export const loadHome = ({ onSuccess = () => {}, onError = () => {}, onStart = () => {} }) => {
  const state = store.getState()
  const { currentLanguage } = store.getState().Languages
  const { lastFetch, Lang } = state.Home
  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes')
  const firstLoad = sessionStorage.getItem('firstLoad_Home')
  const manualRefresh = sessionStorage.getItem('manualRefresh_Home')
  // If API data is fetched within last 10 minutes then don't call the API again
  const shouldFetchData = !firstLoad || manualRefresh === 'true'

  if (currentLanguage?.id != Lang?.language_id || diffInMinutes > 10 || shouldFetchData) {
    
    store.dispatch(
      apiCallBegan({
        ...getHomeWebSettingsApi(),
        displayToast: false,
        onStartDispatch: homeRequested.type,
        onSuccessDispatch: homeReceived.type,
        onErrorDispatch: homeRequestFailed.type,
        onStart,
        onSuccess: res => {
          sessionStorage.setItem('lastFetch_Home', Date.now())
        },
        onError
      })
    )
    // Clear manualRefresh flag
    sessionStorage.removeItem('manualRefresh_Home')

    // Set firstLoad flag to prevent subsequent calls
    sessionStorage.setItem('firstLoad_Home', 'true')
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('manualRefresh_Home', 'true')
  })

  window.addEventListener('load', () => {
    // Check if this is a manual refresh by checking if lastFetch is set
    if (!sessionStorage.getItem('lastFetch_Home')) {
      sessionStorage.setItem('manualRefresh_Home', 'true')
    }
  })
}

// Selector Functions
export const selectHome = createSelector(
  state => state.Home,
  Home => Home
)
