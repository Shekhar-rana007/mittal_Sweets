import React from 'react'

const LoadingScreen = () => {
  return (
    <div className='w-100 d-flex align-items-center justify-content-center' style={{height:'50vh'}}>
    <div className="spinner-border" role="status" style={{width:100,height:100}}/>
    </div>
  )
}

export default LoadingScreen