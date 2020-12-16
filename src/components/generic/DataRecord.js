import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";

export const DataRecord = (
  {
    id = "",
    pathIdIndex = 2,
    table = {name: "modules", label: "Modules"},
    primaryKey = "_id",
    schema=[
      {
        name: "title",
        type: "String",
        label: "Title"
      },
      {
        name: "_id",
        type: "String",
        label: "ID"
      },
      ],
    newRecord={title: "New Course"},
    neuid="jannunzi",
    match,
    cancelLink,
    cancelUrl
  }) => {
  const findRecordById = (id) =>
    fetch(`https://wbdv-generic-server.herokuapp.com/api/${neuid}/${table.name}/${id}`, {
      credentials: "include"
    })
      .then(response => response.json())

  const [record, setRecord] = useState({})
  useEffect(() => {
    const pathname = window.location.pathname.split("/")
    debugger
    if(pathIdIndex) {
      const id = pathname[pathIdIndex]
      findRecordById(id)
        .then(record => setRecord(record))
    } else if(id) {
      findRecordById(id)
        .then(record => setRecord(record))
    } else if(match.params.id) {
      findRecordById(id)
        .then(record => setRecord(record))
    } else {
      const id = pathname[pathname.length - 1]
      findRecordById(id)
        .then(record => setRecord(record))
    }
  }, [])
  return(
    <>
      <h1>{table.label}</h1>
      <ul className="list-group">
        {
          schema.map(field =>
            <li key={field.name} className="list-group-item">
              <div className="row">
                <div className="col-2">
                  {field.label}
                </div>
                <div className="col-10">
                    {
                      field.type === String && !field.enum &&
                      <input
                        onChange={(event) => {
                          const value = event.target.value
                          setRecord(prevRow => {
                            let newRow = {...prevRow}
                            newRow[field.name] = value
                            return newRow
                          })
                        }}
                        value={record[field.name]}
                        className="form-control"/>
                    }
                    {
                      field.type === String && field.enum &&
                      <select
                        onChange={(event) => {
                          const value = event.target.value
                          setRecord(prevRow => {
                            let newRow = {...prevRow}
                            newRow[field.name] = value
                            return newRow
                          })
                        }}
                        value={record[field.name]}
                        className="form-control">
                        <option></option>
                        {
                          field.enum.map(option =>
                            <option key={option}>{option}</option>
                          )
                        }
                      </select>
                    }
                    {
                      field.type === Date &&
                      <input
                        onChange={(event) => {
                          const value = event.target.value
                          setRecord(prevRow => {
                            let newRow = {...prevRow}
                            newRow[field.name] = value
                            return newRow
                          })
                        }}
                        type="Date"
                        value={record[field.name]}
                        className="form-control"/>
                    }
                    {
                      field.type === Number &&
                      <input
                        onChange={(event) => {
                          const value = event.target.value
                          setRecord(prevRow => {
                            let newRow = {...prevRow}
                            newRow[field.name] = value
                            return newRow
                          })
                        }}
                        type="Number"
                        value={record[field.name]}
                        className="form-control"/>
                    }
                </div>
              </div>
            </li>
          )
        }
      </ul>
      <button className="btn btn-danger">Delete</button>
      <button className="btn btn-success">Save</button>
      {
        cancelLink &&
          <Link to={cancelLink} className="btn btn-danger">
            Cancel
          </Link>
      }
      {
        !cancelLink && cancelUrl &&
        <a href={cancelUrl} className="btn btn-danger">
        Cancel
        </a>
      }
      <button className="btn btn-primary">
        Create
      </button>
      <button className="btn btn-primary">
        Search
      </button>
    </>
  )
}
