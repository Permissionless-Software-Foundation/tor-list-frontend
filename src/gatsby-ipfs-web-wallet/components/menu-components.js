/*
  This file is how you add new menu items to your site. It uses the Gatsby
  concept of Component Shadowing:
  https://www.gatsbyjs.org/blog/2019-04-29-component-shadowing/

  It over-rides he default file in the gatsby-ipfs-web-wallet Theme.
*/

import React from 'react'
import { Sidebar } from 'adminlte-2-react'

import Browse from '../../components/orbit/browse'
import Write from '../../components/orbit/write'

const { Item } = Sidebar

const MenuComponents = [
  {
    key: 'Browse',
    component: <Browse key='browse-component' />,
    menuItem: <Item icon='fas-search' key='Browse' text='Browse' />
  },
  {
    key: 'Write',
    component: <Write key='write-component' />,
    menuItem: <Item icon='fas-plus-square' key='Write Component' text='Write' />
  }
]

export default MenuComponents
