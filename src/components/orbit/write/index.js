import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Box, Content, Button, Inputs } from 'adminlte-2-react'
import axios from 'axios'

const { Text } = Inputs

const initialState = {
  site: '',
  msg: '',
  inFetch: false,
  isError: ''
}

const SERVER = process.env.GATSBY_API_URL

let _this
class Write extends React.Component {
  constructor (props) {
    super(props)
    _this = this

    this.state = initialState
  }

  render () {
    return (
      <Content browserTitle='Add entry to Tor list'>
        <Row className='flex justify-content-center'>
          <Col xs={12} md={10}>
            <Box className='shadow border-none mt-2'>
              <Row>
                <Col xs={12} className='text-center'>
                  <h1>
                    <FontAwesomeIcon
                      className='title-icon'
                      size='xs'
                      icon='plus-square'
                    />
                    <span>
                      Add entry to Tor list
                    </span>
                  </h1>
                </Col>
                <Col sm={12} className='text-center mt-1 mb-1'>
                  <Row className='flex justify-content-center'>
                    <Col sm={8}>
                      <div>
                        <Text
                          id='website-input'
                          name='website'
                          placeholder='example.com'
                          label='Website url'
                          labelPosition='above'
                          value={_this.state.site}
                          onChange={_this.handleUpdate}
                          disabled={_this.state.inFetch}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col sm={12} className='text-center mb-2'>
                  <Button
                    text='Submit'
                    type='primary'
                    className='btn-lg'
                    onClick={_this.handlePostSite}
                    disabled={_this.state.inFetch}
                  />
                </Col>
                <Col sm={12} className='text-center'>
                  {_this.state.msg && (
                    <p className={_this.state.isError ? 'error-color' : ''}>
                      {_this.state.msg}
                    </p>
                  )}
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
      </Content>
    )
  }

  handleUpdate (e) {
    // url don't have spaces
    _this.setState({ site: e.target.value.replace(/\s+/g, '') })
  }

  async handlePostSite () {
    try {
      _this.setState({ inFetch: true })

      console.log(`_this.state.site: ${_this.state.site}`)

      const res = await axios({
        // url: 'https://tor-list-api.fullstack.cash/orbitdb/write',
        // url: 'http://127.0.0.1:5001/orbitdb/write',
        url: `${SERVER}/orbitdb/write`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { entry: _this.state.site }
      })

      _this.setState({
        msg: `Succesfully added to the database (hash : ${res.data.hash})`,
        inFetch: false,
        isError: false,
        site: ''
      })
    } catch (e) {
      _this.setState({
        inFetch: false,
        isError: true,
        msg: e.message
      })
    } finally {
      setTimeout(_this.hideMessage, 4000)
    }
  }

  hideMessage () {
    _this.setState({ isError: false, msg: '' })
  }
}

export default Write
