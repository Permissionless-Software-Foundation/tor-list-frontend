import React from 'react'
import { Col, Inputs } from 'adminlte-2-react'
import { handleLogin } from '../services/auth'
const { Text } = Inputs

const emailChecker = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(.\\w{2,3})+$')
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

  async handleLogin (e) {
    e.preventDefault()

    if (_this.isInvalid()) {
      return
    }
    _this.setState({ inFetch: true })
    const res = await handleLogin(_this.state)
    if (!res.status) {
      this.onError(res.message)
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
      <form className='flex-center flex-column' onSubmit={_this.handleLogin}>
        <Col sm={8}>
          <Text
            size='lg'
            id='email'
            name='email'
            label='User'
            labelPosition='above'
            inputType='email'
            value={_this.state.email}
            onChange={_this.handleUpdate}
            disabled={_this.state.inFetch}
          />
          <Text
            size='lg'
            id='password'
            name='password'
            label='Password'
            labelPosition='above'
            inputType='password'
            value={_this.state.password}
            onChange={_this.handleUpdate}
            disabled={_this.state.inFetch}
          />
        </Col>
        <Col sm={12} className='text-center mb-1'>
          <button
            type='submit'
            className='btn btn-primary btn-lg'
            onClick={_this.handleLogin}
            disabled={_this.state.inFetch || _this.isInvalid()}
          >
            Submit
          </button>
        </Col>
        <Col sm={12} className='text-center'>
          {_this.state.message && (
            <p className='error-color'>
              {_this.state.message}
            </p>
          )}
        </Col>
      </form>
    )
  }
}

export default LoginForm
