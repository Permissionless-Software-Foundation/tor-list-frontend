import React from 'react'
import { navigate } from 'gatsby'
import LoginForm from '../components/login-form'
import Footer from '../components/footer'

import './admin.css'

let _this
class Homepage extends React.Component {
  constructor (props) {
    super()
    _this = this

    this.state = {}
  }

  handleLogin () {
    navigate('/')
  }

  render () {
    return (
      <div className='main-container'>
        <header>
          <div className='flex-center header-version-status'>
            <div>
              <p>Warning: Open Alpha - things will break</p>
            </div>
          </div>
        </header>
        <main>
          <div className='login-box-container flex justify-content-center'>
            <div className='col-10 col-md-6'>
              <div className='shadow border-none mt-3'>
                <div className='d-flex'>
                  <div className='col-12 text-center'>
                    <h1>
                      <span>Admin - Log in</span>
                    </h1>
                  </div>
                  <div className='col-12 text-center mt-1 mb-1'>
                    <LoginForm onLogin={_this.handleLogin} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    )
  }

  componentDidMount () {
    _this.hideSplashLoader()
  }

  hideSplashLoader () {
    try {
      const loader = document.getElementById('___loader')
      loader.className = 'display-none'
    } catch (error) {
      console.warn(error)
    }
  }
}

export default Homepage
