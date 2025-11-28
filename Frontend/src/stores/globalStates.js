import { ref, watch } from 'vue'

// Persist values on page refresh so it doesnt log u out
function usePersistentRef(key, defaultValue = '') {
  const data = ref(localStorage.getItem(key) || defaultValue)
  watch(data, (val) => {
    localStorage.setItem(key, val)
  })
  return data
}

function usePersistentRefBoolean(key, defaultValue = false) {
  const stored = localStorage.getItem(key)
  const data = ref(stored === 'true' ? true : stored === 'false' ? false : defaultValue)
  watch(data, (val) => localStorage.setItem(key, val))
  return data
}

export const ISLOGGEDIN = usePersistentRefBoolean('ISLOGGEDIN', false)

// Global state
export const FIRSTNAME = usePersistentRef('FIRSTNAME')
export const LASTNAME = usePersistentRef('LASTNAME')
export const PROFILECOLOR = usePersistentRef('PROFILECOLOR')
export const EMAIL = usePersistentRef('EMAIL')
export const NICKNAME = usePersistentRef('NICKNAME')
export const PASSWORD = ref([])
export const CONFIRMPASSWORD = ref([])
export const TOKEN = usePersistentRef('TOKEN')

export const SELECTEDCHANNEL = usePersistentRef('SELECTEDCHANNEL', null)

// Messages from currently selected channel
export const MESSAGES = ref([])
