import React from 'react'
import { handleLogin } from '../services/auth'

import './login-form.css'

const emailChecker = new RegExp(
  '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(.\\w{2,3})+$'
)
let _this

class LoginForm extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      message: '',
      email: '',
      password: '',
      inFetch: false
    }
  }

  isValidEmail (email) {
    if (email.match(emailChecker)) {
      return true
    }
    return false
  }

  isInvalid () {
    const { email, password } = _this.state
    return !password.trim() || !email.trim() || !_this.isValidEmail(email)
  }

  async handleSubmitButton (e) {
    e.preventDefault()

    if (_this.isInvalid()) {
      return
    }

    _this.setState({ inFetch: true })

    console.log('_this.state: ', _this.state)

    const res = await handleLogin(_this.state)
    if (!res.status) {
      _this.onError(res.message)
      return
    }

    _this.props.onLogin()
  }

  onError (message) {
    message = message || 'Invalid credentials'
    _this.setState({ message, inFetch: false })

    setTimeout(() => _this.setState({ message: '' }), 3000)
  }

  handleUpdate (e) {
    _this.setState({
      [e.target.name]: e.target.value.replace(/\s+/, '')
    })
  }

  render () {
    return (
      <form className='flex-center flex-column'>
        <div className='col-8'>
          <div className='form-group'>
            <label htmlFor='email'>User</label>
            <div
              className='input-group input-group-lg'
              style={{ width: '100%' }}
            >
              <input
                type='email'
                className='form-control input-lg'
                name='email'
                id='email'
                value={_this.state.email}
                onChange={_this.handleUpdate}
                disabled={_this.state.inFetch}
              />
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <div
              className='input-group input-group-lg'
              style={{ width: '100%' }}
            >
              <input
                type='password'
                className='form-control input-lg'
                name='password'
                id='password'
                value={_this.state.password}
                onChange={_this.handleUpdate}
                disabled={_this.state.inFetch}
              />
            </div>
          </div>
        </div>
        <div className='col-12 text-center mb-1'>
          <button
            type='submit'
            className='btn btn-primary btn-lg'
            onClick={_this.handleSubmitButton}
            disabled={_this.state.inFetch || _this.isInvalid()}
          >
            Submit
          </button>
        </div>
        <div className='col-12 text-center'>
          {_this.state.message && (
            <p className='error-color'>{_this.state.message}</p>
          )}
        </div>
      </form>
    )
  }
}

export default LoginForm
