import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";

export default function DataTable(
  {
    table = {name: "users", label: "Users"},
    primaryKey = "_id",
    schema=[
      {name: "username",type: "String"},
      {name: "password",type: "String"},
      {name: "firstName",type: "String"},
      {name: "lastName",type: "String"},
    ],
    defaultRecord={title: "New User"},
    detailLink="",
    neuid="jannunzi"
  }) {
  const [rows, setRows] = useState([])
  const [editing, setEditing] = useState("")
  const [editingRow, setEditingRow] = useState({})
  useEffect(() => {
    fetch(`https://wbdv-generic-server.herokuapp.com/api/${neuid}/${table.name}`, {
      credentials: "include"
    })
      .then(response => response.json())
      .then(rows => setRows(rows))
  }, [])
  function createRecord() {
    fetch(`https://wbdv-generic-server.herokuapp.com/api/${neuid}/${table.name}`, {
      method: 'POST',
      body: JSON.stringify(defaultRecord),
      headers: {
        'content-type': 'application/json'
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(newRow => {
        setRows((prevRows) => {
          const newRows = [
            ...prevRows,
            newRow
          ]
          return newRows
        })
      })
  }
  function deleteRecord(id) {
    fetch(`https://wbdv-generic-server.herokuapp.com/api/${neuid}/${table.name}/${id}`, {
      method: 'DELETE',
      credentials: "include"
    })
      .then(response => response.json())
      .then(status => {
        setRows((prevRows) => {
          const newRows = prevRows.filter(row => row[primaryKey] !== id)
          return newRows
        })
      })
  }
  function updateRecord(id, newRow) {
    fetch(`https://wbdv-generic-server.herokuapp.com/api/${neuid}/${table.name}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newRow),
      headers: {
        'content-type': 'application/json'
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(status => {
        setRows((prevRows) => {
          const newRows = prevRows.map(row => row[primaryKey] === id ? newRow : row)
          return newRows
        })
      })
  }
  return(
    <>
      <h1>{table.label}</h1>
      <table className="table table-striped">
        <thead>
          <tr className="">
            {
              schema.map(column =>
                <td key={column.name}>
                  {column.label}
                </td>
              )
            }
            <td>
              <i onClick={createRecord} className="float-right fa-2x fa fa-plus"></i>
            </td>
          </tr>
        </thead>
        <tbody>
        {
          rows.map((row, ndx) =>
            <tr key={ndx}>
              {
                schema.map((column, ndx) =>
                  <td key={ndx}>
                    {
                      editing === row[primaryKey] &&
                      <span>
                        {
                          column.type === String && !column.oneOf && !column.anyOf &&
                          <input
                            onChange={(event) => {
                              const value = event.target.value
                              setEditingRow(prevRow => {
                                let newRow = {...prevRow}
                                newRow[column.name] = value
                                return newRow
                              })
                            }}
                            value={editingRow[column.name]}
                            className="form-control"/>
                        }
                        {
                          column.type === String &&
                          column.oneOf &&
                          column.widget === "select" &&
                          <select
                            onChange={(event) => {
                              const value = event.target.value
                              setEditingRow(prevRow => {
                                let newRow = {...prevRow}
                                newRow[column.name] = value
                                return newRow
                              })
                            }}
                            value={editingRow[column.name]}
                            className="form-control">
                            <option></option>
                            {
                              column.oneOf.map(option =>
                                <option key={option}>{option}</option>
                              )
                            }
                          </select>
                        }
                        {
                          column.type === String &&
                          column.oneOf &&
                          column.widget === "radio" &&
                          <ul className="list-group">
                            {
                              column.oneOf.map(option =>
                                <li key={option} className="list-group-item">
                                  <label>
                                    <input
                                      onChange={(event) => {
                                        const checked = event.target.checked
                                        setEditingRow(prevRow => {
                                          let newRow = {...prevRow}
                                          newRow[column.name] = option
                                          return newRow
                                        })
                                      }}
                                      type="radio"
                                      checked={editingRow[column.name] === option}
                                      name={column.name}/>{option}
                                  </label>
                                </li>
                              )
                            }
                          </ul>
                        }
                        {
                          column.type === String &&
                          column.anyOf &&
                          column.widget === "checkbox" &&
                          <ul className="list-group">
                            {
                              column.anyOf.map(option =>
                                <li key={option} className="list-group-item">
                                  <label>
                                    <input
                                      onChange={(event) => {
                                        const checked = event.target.checked
                                        setEditingRow(prevRow => {
                                          let newRow = {...prevRow}
                                          if(!newRow[column.name]) {
                                            newRow[column.name] = [option]
                                          } else {
                                            debugger
                                            const index = newRow[column.name].indexOf(option)
                                            if(checked && index >= 0) {
                                              // newRow[column.name] = newRow[column.name].splice(index, 1)
                                            } else if(checked && index < 0) {
                                              newRow[column.name].push(option)
                                            } else if(!checked && index >= 0) {
                                              newRow[column.name] = newRow[column.name].splice(index, 1)
                                            }
                                            // newRow[column.name] = column.anyOf.map(o => {
                                            //   debugger
                                            //   return o === option && checked ? option : null
                                            // })
                                          }
                                          return newRow
                                        })
                                      }}
                                      type="checkbox"
                                      checked={editingRow[column.name] && editingRow[column.name].indexOf(option) >= 0}
                                      name={column.name}/>{option}
                                  </label>
                                </li>
                              )
                            }
                          </ul>
                        }
                        {
                          column.type === Date &&
                          <input
                            onChange={(event) => {
                              const value = event.target.value
                              setEditingRow(prevRow => {
                                let newRow = {...prevRow}
                                newRow[column.name] = value
                                return newRow
                              })
                            }}
                            type="Date"
                            value={editingRow[column.name]}
                            className="form-control"/>
                        }
                        {
                          column.type === Number &&
                          <input
                            onChange={(event) => {
                              const value = event.target.value
                              setEditingRow(prevRow => {
                                let newRow = {...prevRow}
                                newRow[column.name] = value
                                return newRow
                              })
                            }}
                            type="Number"
                            value={editingRow[column.name]}
                            className="form-control"/>
                        }
                        {
                          column.type === Boolean &&
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              const checked = event.target.checked
                              setEditingRow(prevRow => {
                                let newRow = {...prevRow}
                                newRow[column.name] = checked
                                return newRow
                              })
                            }}
                            checked={editingRow[column.name]}
                            className="form-control"/>
                        }
                      </span>
                    }
                    {
                      editing !== row[primaryKey] &&
                      <span>
                        {
                          detailLink &&
                            <Link to={`${detailLink.replace(":id",row[primaryKey])}`}>
                              {
                                column.type === Boolean &&
                                JSON.stringify(row[column.name])
                              }
                              {
                              column.type !== Boolean &&
                                <span>
                                  {
                                    column.type === String &&
                                    <span>
                                      {
                                        column.anyOf &&
                                        row[column.name] && row[column.name].join(",")
                                      }
                                      {
                                        !column.anyOf &&
                                        row[column.name]
                                      }
                                    </span>
                                  }
                                </span>
                              }
                            </Link>
                        }
                        {
                          !detailLink &&
                            <span>
                              {row[column.name]}
                            </span>
                        }
                      </span>
                    }
                  </td>
                )
              }
              <td>
                <i onClick={() => deleteRecord(row[primaryKey])} className="float-right fa fa-2x fa-remove"></i>
                {
                  editing !== row[primaryKey] &&
                  <i onClick={() => {
                    setEditing(row[primaryKey])
                    setEditingRow(row)
                  }} className="float-right fa fa-2x fa-pencil"></i>
                }
                {
                  editing === row[primaryKey] &&
                  <i onClick={() => {
                    setEditing("")
                    updateRecord(row[primaryKey], editingRow)
                  }} className="float-right fa fa-2x fa-check"></i>
                }
              </td>
            </tr>
          )
        }
        </tbody>
      </table>
    </>
  )
}
