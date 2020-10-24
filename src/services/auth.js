/*
  Interacts with the REST API for logging in a user.
*/

import axios from 'axios'

const SERVER = process.env.AUTHSERVER

export const isBrowser = () => typeof window !== 'undefined'

export const getLocalUser = () =>
  isBrowser() && window.localStorage.getItem('gatsbyUser')
    ? JSON.parse(window.localStorage.getItem('gatsbyUser'))
    : {}

export const setLocalUser = user =>
  window.localStorage.setItem('gatsbyUser', JSON.stringify(user))

export const handleLogin = async ({ email, password }) => {
  // Try to authenticate.
  try {
    console.log('server: ', SERVER)

    const options = {
      url: `${SERVER}/auth`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        email: email,
        password: password
      })
    }
    const res = await axios(options)
    const users = res.data

    console.log(`users: ${JSON.stringify(users, null, 2)}`)

    setLocalUser({
      username: users.user.username,
      jwt: users.token,
      userdata: users,
      email: users.user.email
    })

    return { status: true, message: '' }
  } catch (err) {
    // If something goes wrong with auth, return false.
    return { status: false, message: err.message }
  }
}

export const isLoggedIn = () => {
  const user = getLocalUser()
  return Boolean(user.email)
}

export const logout = callback => {
  setLocalUser({})
  callback()
}
