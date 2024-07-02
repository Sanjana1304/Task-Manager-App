import React from 'react'

const apiReq = async(url='',actionObj=null,errMsg=null) => {
  try {
    const response = await fetch(url,actionObj);
    if (!response.ok) throw Error("Pls refresh the page");
  } catch (error) {
    errMsg = error.message;
  }
  finally{
    return errMsg;
  }
}

export default apiReq