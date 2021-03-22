import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Box, Content, Button, Inputs } from 'adminlte-2-react'
import axios from 'axios'
import './write.css'

const { Text, Select } = Inputs

const initialState = {
  site: '',
  slpAddress: '',
  description: '',
  signature: '',
  category: 'bch',
  msg: '',
  inFetch: false,
  isError: ''
}

const SERVER = process.env.GATSBY_API_URL

let _this
class Write extends React.Component {
  constructor (props) {
    super()
    _this = this

    this.state = initialState
  }

  getCategoryOptions () {
    return [
      { text: 'Bitcoin Cash', value: 'bch' },
      { text: 'eCommerce', value: 'ecommerce' },
      { text: 'Information', value: 'info' },
      { text: 'Ethereum', value: 'eth' },
      { text: 'IPFS', value: 'ipfs' }
    ]
  }

  isInvalid () {
    return (
      !_this.state.site.trim() ||
      !_this.state.slpAddress.trim() ||
      !_this.state.description.trim() ||
      !_this.state.signature.trim() ||
      !_this.state.category.trim()
    )
  }

  handleUpdateTrim (e) {
    // url don't have spaces
    _this.setState({ [e.target.name]: e.target.value.replace(/\s+/g, '') })
  }

  handleUpdate (e) {
    _this.setState({ [e.target.name]: e.target.value })
  }

  getSiteValues () {
    return {
      entry: _this.state.site.trim(),
      slpAddress: _this.state.slpAddress.trim(),
      description: _this.state.description.trim(),
      signature: _this.state.signature.trim(),
      category: _this.state.category
    }
  }

  async handlePostSite () {
    try {
      if (_this.isInvalid()) {
        throw new Error('Missing information')
      }
      _this.setState({ inFetch: true })
      console.log(`_this.state.site: ${_this.state.site}`)

      console.log(`SERVER: ${SERVER}`)

      const res = await axios({
        // url: 'https://tor-list-api.fullstack.cash/orbitdb',
        // url: 'http://127.0.0.1:5001/orbitdb',
        url: `${SERVER}/orbitdb`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: _this.getSiteValues()
      })

      _this.setState({
        ...initialState,
        msg: `Succesfully added to the database (hash : ${res.data.hash})`
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

  async handleSign () {
    try {
      const { site } = _this.state
      const { privateKey } = _this.props.walletInfo
      const { bchjs } = _this.props.bchWallet

      if (!site) {
        throw new Error('Site is require')
      }
      _this.setState({
        inFetch: true
      })

      const signature = await bchjs.BitcoinCash.signMessageWithPrivKey(
        privateKey,
        site
      )
      console.log(`Signature : ${signature}`)
      _this.setState({
        inFetch: false,
        signature
      })
    } catch (err) {
      console.error(err)
      _this.setState({
        msg: err.message,
        inFetch: false,
        isError: true
      })
    }
  }

  // Set slp address into text field
  handleSlpAddr () {
    try {
      const { slpAddress } = _this.props.walletInfo
      if (!slpAddress) {
        throw new Error('Wallet Not Found!')
      }
      _this.setState({
        slpAddress
      })
    } catch (err) {
      _this.setState({
        msg: err.message,
        inFetch: false,
        isError: true
      })
    } finally {
      setTimeout(_this.hideMessage, 4000)
    }
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
                    <span>Add entry to Tor list</span>
                  </h1>
                </Col>
                <Col sm={12} className='text-center mt-1 mb-1'>
                  <Row className='flex justify-content-center'>
                    <Col sm={8}>
                      <div>
                        <Text
                          id='website-input'
                          name='site'
                          placeholder='example.com'
                          label='Website url'
                          labelPosition='above'
                          onChange={_this.handleUpdateTrim}
                          value={_this.state.site}
                          disabled={_this.state.inFetch}
                        />
                        <Text
                          id='slp-input'
                          name='slpAddress'
                          label='SLP Address'
                          labelPosition='above'
                          onChange={_this.handleUpdate}
                          value={_this.state.slpAddress}
                          disabled={_this.state.inFetch}
                          buttonRight={
                            <Button
                              type='primary'
                              disabled={_this.state.inFetch}
                              text='ADD'
                              onClick={_this.handleSlpAddr}
                            />
                          }
                        />
                        <Text
                          id='description-input'
                          name='description'
                          inputType='textarea'
                          rows={3}
                          placeholder={"what's this site for?"}
                          label='Description'
                          labelPosition='above'
                          onChange={_this.handleUpdate}
                          value={_this.state.description}
                          disabled={_this.state.inFetch}
                        />
                        <Text
                          id='signature-input'
                          name='signature'
                          label='Signature'
                          labelPosition='above'
                          onChange={_this.handleUpdate}
                          value={_this.state.signature}
                          disabled={_this.state.inFetch || !_this.state.site}
                          buttonRight={
                            <Button
                              type='primary'
                              disabled={
                                _this.state.inFetch || !_this.state.site
                              }
                              text='Sign'
                              onClick={_this.handleSign}
                            />
                          }
                        />
                        <Select
                          label='Category'
                          name='category'
                          options={_this.getCategoryOptions()}
                          onChange={_this.handleUpdate}
                          value={_this.state.category}
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
                    disabled={_this.state.inFetch || _this.isInvalid()}
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
}

export default Write
