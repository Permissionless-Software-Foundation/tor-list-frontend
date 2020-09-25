import React from 'react'
import './browse.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Box, Content } from 'adminlte-2-react'
import axios from 'axios'

const SERVER = process.env.GATSBY_API_URL

let _this
class Browse extends React.Component {
  constructor(props) {
    super()
    _this = this

    this.state = {
      entries: null
    }
  }

  componentDidMount() {
    _this.fetchDbEntries()
  }

  async fetchDbEntries() {
    try {
      const res = await axios({
        method: 'get',
        // url: 'https://tor-list-api.fullstack.cash/orbitdb'
        url: `${SERVER}/orbitdb`
      })

      _this.setState({ entries: res.data.entries })
    } catch (error) {
      console.log(error)
      _this.setState({ entries: [] })
    }
  }

  ContentTable() {
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
      return (
        <tr key={item._id}>
          <td>
            <p><strong>{item.entry}</strong></p>
            <p>{item.description.substring(0, 80)}</p>
          </td>
        </tr>
      )
    });

    return (
      <table className="table">
        { rows }
      </table>
    )
  }

  render() {
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
}

export default Browse
