import React, {useState, useEffect} from 'react'

const SessionAttributes = () => {

  const [attribute1, setAttribute1] = useState("")
  const [value1, setValue1] = useState("")

  const [attribute2, setAttribute2] = useState("")
  const [value2, setValue2] = useState("")

  const setSessionAttributeInServer = (attribute, value) => {
    fetch(`https://spring-template-jga.herokuapp.com/session/set/${attribute}/${value}`)
      .then(response => response.text())
      .then(text => console.log(text))
  }
  const getSessionAttributeFromServer = (attribute) => {
    fetch(`https://spring-template-jga.herokuapp.com/session/get/${attribute}`)
      .then(response => response.text())
      .then(text => setValue2(text))
  }

  return(
    <div>
      <h1>Session Attributes</h1>
      <h2>Set Attribute</h2>
      <div className="row">
        <div className="col-5">
          <input
            value={attribute1}
            onChange={(event) => setAttribute1(event.target.value)}
            className="form-control"/>
        </div>
        <div className="col-5">
          <input
            value={value1}
            onChange={(event) => setValue1(event.target.value)}
            className="form-control"/>
        </div>
        <div className="col-2">
          <button
            onClick={() => setSessionAttributeInServer(attribute1, value1)}
            className="btn btn-block btn-primary">
            Set Attribute
          </button>
        </div>
      </div>

      <h2>Get Attribute</h2>
      <div className="row">
        <div className="col-5">
          <input
            value={attribute2}
            onChange={(event) => setAttribute2(event.target.value)}
            className="form-control"/>
        </div>
        <div className="col-5">
          <input
            value={value2}
            readOnly={true}
            onChange={() => {}}
            className="form-control"/>
        </div>
        <div className="col-2">
          <button
            onClick={() => getSessionAttributeFromServer(attribute2)}
            className="btn btn-block btn-primary">
            Get Attribute
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionAttributes
