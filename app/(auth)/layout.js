import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='flex items-center min-h-screen justify-center'>
      {children}
    </div>
  )
}

export default AuthLayout
