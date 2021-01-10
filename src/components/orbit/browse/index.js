import React from 'react'
import './browse.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Box, Content, Button, Inputs } from 'adminlte-2-react'
import { getLocalUser } from '../../../services/auth'
import axios from 'axios'

const SERVER = process.env.GATSBY_API_URL

const { Select } = Inputs

let _this
class Browse extends React.Component {
  constructor (props) {
    super()
    _this = this
    this.defaultState = {
      showModal: false,
      modalEntry: null,
      category: '',
      entries: null,
      showConfirmModal: false,
      isAdmin: false,
      inFetch: false,
      blackListFetchStatus: {}
    }
    this.state = this.defaultState
  }

  getUserData () {
    let isAdmin
    try {
      const userInfo = getLocalUser()
      console.log('userInfo', userInfo)
      if (userInfo.email) isAdmin = false

      const { user } = userInfo.userdata
      console.log('user', user)

      if (!user) isAdmin = false
      if (user.type === 'admin') isAdmin = true
    } catch (error) {
      isAdmin = false
    }
    console.log('isAdmin', isAdmin)
    _this.setState({
      isAdmin
    })
  }

  componentDidMount () {
    console.log('component did mount')
    _this.getUserData()
    _this.fetchDbEntries()
  }

  async fetchDbEntries (category) {
    try {
      _this.setState({ entries: null })
      const path = category ? `/c/${category}` : ''
      const res = await axios({
        method: 'get',
        // url: `https://tor-list-api.fullstack.cash/orbitdb${path}`
        url: `${SERVER}/orbitdb${path}`
      })

      _this.setState({ entries: res.data.entries })
    } catch (error) {
      console.log(error)
      _this.setState({ entries: [] })
    }
  }

  handleUpdate (e) {
    _this.setState({ [e.target.name]: e.target.value })

    _this.fetchDbEntries(e.target.value)
  }

  getCategoryOptions () {
    return [
      { text: 'All categories', value: '' },
      { text: 'Bitcoin Cash', value: 'bch' },
      { text: 'eCommerce', value: 'ecommerce' },
      { text: 'Information', value: 'info' },
      { text: 'Ethereum', value: 'eth' },
      { text: 'IPFS', value: 'ipfs' }
    ]
  }

  showModal (item) {
    if (!item.entry || !item.description) {
      return
    }
    _this.setState({ modalEntry: item, showModal: true })
  }

  showConfirmModal (item) {
    if (!item.entry || !item.description) {
      return
    }
    _this.setState({ modalEntry: item, showConfirmModal: true })
  }

  handleHideModal () {
    _this.setState({
      modalEntry: null,
      showModal: false,
      showConfirmModal: false
    })
  }

  // Adds an entry to the black list
  async addToBlackList (entry) {
    try {
      console.log('entry', entry)
      _this.setState({ inFetch: true })
      const { jwt } = getLocalUser()
      const options = {
        url: `${SERVER}/blacklist`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        data: {
          hash: entry._id,
          reason: 'Unspecified'
        }
      }
      const res = await axios(options)
      _this.setState({
        inFetch: false,
        blackListFetchStatus: {
          success: true,
          msg: res.data.message
        }
      })
    } catch (e) {
      _this.setState({
        inFetch: false,
        blackListFetchStatus: {
          success: false,
          msg: e.message
        }
      })
    }
  }

  async restartComponent () {
    _this.setState(this.defaultState)
    _this.componentDidMount()
  }

  afterAddBlackList () {
    const { blackListFetchStatus } = _this.state
    if (blackListFetchStatus.success) {
      _this.restartComponent()
    } else {
      _this.handleHideModal()
      _this.setState({
        blackListFetchStatus: {}
      })
    }
  }

  ContentTable () {
    if (!_this.state.entries) {
      return <Box className='p-5 no-shadow border-none' loaded={false} />
    }
    if (!_this.state.entries.length) {
      return (
        <div className='p-5 text-center'>
          <p>There are no entries to show</p>
        </div>
      )
    }

    const rows = _this.state.entries.map((item) => {
      const isLonger = item.description.length > 80
      const eol = isLonger ? '...' : ''
      const url = item.entry.startsWith('http://') || item.entry.startsWith('https://')
        ? item.entry : `http://${item.entry}`
      return (
        <tr key={item._id}>
          <td>
            <p>
              <a href={url} target='_blank' className='dark-text' rel='noopener noreferrer'>
                <strong>{item.entry}</strong>
              </a>
            </p>
            <p>
              {item.description.substring(0, 80) + eol}
            </p>

            {
              _this.state.isAdmin && (
                <FontAwesomeIcon
                  className='icon'
                  size='lg'
                  icon='trash'
                  onClick={() => _this.showConfirmModal(item)}
                />
              )
            }
          </td>
          <td className='more-info'>
            <div>
              {!isLonger ? '' : <Button text='more info' onClick={() => _this.showModal(item)} />}
            </div>
          </td>

        </tr>
      )
    })

    return (
      <table className='table'>
        <thead />
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }

  modalFooter () {
    return <Button text='Close' onClick={_this.handleHideModal} />
  }

  confirmModalFooter (item) {
    const { blackListFetchStatus } = _this.state
    return (
      <div>
        {/*   Confirmation buttons */}
        {!blackListFetchStatus.msg && (
          <div>
            <Button text='Yes' onClick={() => _this.addToBlackList(item)} />
            <Button text='No' onClick={_this.handleHideModal} />
          </div>
        )}

        {/* Button to close the modal once the call to the api finishes */}
        {blackListFetchStatus.msg && (
          <div>
            <Button
              text='Close' onClick={() => {
                _this.afterAddBlackList()
              }}
            />
          </div>
        )}
      </div>
    )
  }

  render () {
    const {
      modalEntry: item,
      showModal,
      showConfirmModal,
      inFetch,
      blackListFetchStatus
    } = _this.state
    return (
      <Content browserTitle='Browse - Tor list'>
        <Row>
          <Col md={1} />
          <Col xs={12} md={10}>
            <Box className='shadow border-none mt-2'>
              <Row>
                <Col xs={12} className='text-center'>
                  <h1>
                    <FontAwesomeIcon
                      className='title-icon'
                      size='xs'
                      icon='search'
                    />
                    <span>
                      Browse - Tor list
                    </span>
                  </h1>
                </Col>
                <Col xs={12}>
                  <Select
                    label='Filter by category'
                    name='category'
                    options={_this.getCategoryOptions()}
                    onChange={_this.handleUpdate}
                    value={_this.state.category}
                  />
                  {_this.ContentTable()}
                </Col>
              </Row>
            </Box>
          </Col>
          <Col md={1} />
        </Row>
        {/* Modal to describe the entry information */}
        <Content
          modal
          title={item ? item.entry : ''}
          show={showModal}
          modalFooter={_this.modalFooter()}
        >
          {item ? item.description : ''}
        </Content>

        {/* Confirmation Modal to add an entry to the black list */}
        <Content
          modal
          title={item ? item.entry : ''}
          show={showConfirmModal}
          onHide={blackListFetchStatus.success ? _this.afterAddBlackList : _this.handleHideModal}
          modalFooter={_this.confirmModalFooter(item)}
        >

          <Box loaded={!inFetch} className='border-none'>
            {blackListFetchStatus.msg || 'Are you sure you want to blacklist this entry?'}

          </Box>
        </Content>

      </Content>
    )
  }
}

export default Browse
