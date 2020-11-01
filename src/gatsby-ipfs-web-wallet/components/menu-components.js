/*
  This file is how you add new menu items to your site. It uses the Gatsby
  concept of Component Shadowing:
  https://www.gatsbyjs.org/blog/2019-04-29-component-shadowing/

  It over-rides he default file in the gatsby-ipfs-web-wallet Theme.
*/

import React from 'react'
import { Sidebar } from 'adminlte-2-react'

import Wallet from 'gatsby-ipfs-web-wallet/src/components/admin-lte/wallet'
import Tokens from 'gatsby-ipfs-web-wallet/src/components/admin-lte/tokens'
import Configure from 'gatsby-ipfs-web-wallet/src/components/admin-lte/configure'
import SendReceive from 'gatsby-ipfs-web-wallet/src/components/admin-lte/send-receive'

import Browse from '../../components/orbit/browse'
import Write from '../../components/orbit/write'

const { Item } = Sidebar

const MenuComponents = props => [
  {
    key: 'Browse',
    component: <Browse key='browse-component' />,
    menuItem: <Item icon='fas-search' key='Browse' text='Browse' />,
    active: true
  },
  {
    key: 'Write',
    component: <Write key='write-component' />,
    menuItem: <Item icon='fas-plus-square' key='Write Component' text='Write' />
  },
  {
    key: 'Tokens',
    component: <Tokens key='Tokens' {...props} />,
    menuItem: <Item icon='fas-coins' key='Tokens' text='Tokens' />
  },
  {
    key: 'Send/Receive BCH',
    component: <SendReceive key='Send/Receive BCH' {...props} />,
    menuItem: (
      <Item
        icon='fa-exchange-alt'
        key='Send/Receive BCH'
        text='Send/Receive BCH'
      />
    )
  },
  {
    key: 'Wallet',
    component: <Wallet key='Wallet' {...props} />,
    menuItem: <Item icon='fa-wallet' key='Wallet' text='Wallet' />
  },
  {
    key: 'Configure',
    component: <Configure key='Configure' {...props} />,
    menuItem: <Item icon='fas-cog' key='Configure' text='Configure' />
  }
]

export default MenuComponents
