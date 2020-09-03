import React from 'react'
import './browse.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Box, Content, SimpleTable } from 'adminlte-2-react'
import axios from 'axios'

const SERVER = process.env.GATSBY_API_URL

let _this
class Browse extends React.Component {
  constructor (props) {
    super(props)
    _this = this

    this.state = {
      entries: null
    }
  }

  render () {
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
                  {_this.ContentTable()}
                </Col>
              </Row>
            </Box>
          </Col>
          <Col md={1} />
        </Row>
      </Content>
    )
  }

  componentDidMount () {
    _this.fetchDbEntries()
  }

  ContentTable () {
    if (!_this.state.entries) {
      return <Box className='p-5 no-shadow border-none' loaded={false} />
    }
    if (!_this.state.entries.length) {
      return (
        <div className='p-5 text-center'>
          <p>There are not entries to show</p>
        </div>
      )
    }
    return <SimpleTable data={_this.state.entries} columns={columns} />
  }

  async fetchDbEntries () {
    try {
      const res = await axios({
        method: 'get',
        // url: 'https://tor-list-api.fullstack.cash/orbitdb/entries'
        url: `${SERVER}/orbitdb/entries`
      })
      _this.setState({ entries: res.data.entries })
    } catch (error) {
      console.log(error)
      _this.setState({ entries: [] })
    }
  }
}

const columns = [{ data: 'message' }]

export default Browse
