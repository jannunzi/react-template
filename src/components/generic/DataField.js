import React from 'react'
import {Link} from "react-router-dom";

const DataField = (
  {
    editing,
    row,
    column,
    primaryKey,
    setEditingRow,
    editingRow,
    detailLink
  }) =>
  <div>
    {
      editing === row[primaryKey] &&
      <span>
        {
          column.type === String &&
          !column.oneOf &&
          !column.anyOf &&
          column.widget !== "textarea" &&
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
          column.widget === "textarea" &&
          <textarea
            onChange={(event) => {
              const value = event.target.value
              setEditingRow(prevRow => {
                let newRow = {...prevRow}
                newRow[column.name] = value
                return newRow
              })
            }}
            value={editingRow[column.name]}
            className="form-control"></textarea>
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
                      className="form-control gx-width-5-pc"
                      onChange={(event) => {
                        const checked = event.target.checked
                        setEditingRow(prevRow => {
                          let newRow = {...prevRow}
                          if (!newRow[column.name]) {
                            newRow[column.name] = [option]
                          } else {
                            const index = newRow[column.name].indexOf(option)
                            if (checked && index < 0) {
                              newRow[column.name].push(option)
                            } else if (!checked && index >= 0) {
                              newRow[column.name] = newRow[column.name].splice(index, 1)
                            }
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
          <Link to={`${detailLink.replace(":id", row[primaryKey])}`}>
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
  </div>

export default DataField
