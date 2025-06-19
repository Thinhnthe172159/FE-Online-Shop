import React from 'react'
import { Mosaic } from 'react-loading-indicators'
import './loading.scss'
const Loading = () => {
  return (
    <div id='loading'>
        <Mosaic color="#ffcf20" size="medium" text="" textColor="#772e2e" />
    </div>
  )
}

export default Loading