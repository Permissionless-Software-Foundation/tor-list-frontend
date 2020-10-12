import React from 'react'
import { navigate } from 'gatsby'
import LoginForm from '../components/login-form'

import { Row, Col, Box } from 'adminlte-2-react'

import './admin.css'

import Footer from 'gatsby-ipfs-web-wallet/src/components/footer/index'

let _this
class Homepage extends React.Component {
  constructor (props) {
    super()
    _this = this

    this.state = {}
  }

  handleLogin () {
    navigate('/browse')
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
          <Row className='login-box-container flex justify-content-center'>
            <Col xs={10} md={6}>
              <Box className='shadow border-none mt-2'>
                <Row>
                  <Col xs={12} className='text-center'>
                    <h1>
                      <span>Admin - Log in</span>
                    </h1>
                  </Col>
                  <Col sm={12} className='text-center mt-1 mb-1'>
                    <LoginForm onLogin={_this.handleLogin} />
                  </Col>
                </Row>
              </Box>
            </Col>
          </Row>
          <Footer />
        </main>
      </div>
    )
  }
}

export default Homepage
