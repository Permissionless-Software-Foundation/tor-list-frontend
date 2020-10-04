import React from 'react'
import './browse.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Box, Content, Button, Inputs } from 'adminlte-2-react'
import axios from 'axios'

const SERVER = process.env.GATSBY_API_URL

const { Select } = Inputs

let _this
class Browse extends React.Component {
  constructor (props) {
    super()
    _this = this

    this.state = {
      showModal: false,
      modalEntry: null,
      category: '',
      entries: null
    }
  }

  componentDidMount () {
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

  handleHideModal () {
    _this.setState({ modalEntry: null, showModal: false })
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

  render () {
    const { modalEntry: item, showModal } = _this.state
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
        <Content
          modal
          title={item ? item.entry : ''}
          show={showModal}
          modalFooter={_this.modalFooter()}
        >
          {item ? item.description : ''}
        </Content>
      </Content>
    )
  }
}

export default Browse
