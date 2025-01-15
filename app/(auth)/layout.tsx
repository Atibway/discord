

import React from 'react'

const AuthLayout = async({
    children
}:{children: React.ReactNode},
  
) => {

  return (
    <div className="bg-primary-foreground" >
    {children}
   </div>
  )
}
 


export default AuthLayout