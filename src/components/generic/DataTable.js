import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import DataField from "./DataField";

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
                    <DataField
                      editing={editing}
                      row={row}
                      column={column}
                      detailLink={detailLink}
                      editingRow={editingRow}
                      primaryKey={primaryKey}
                      setEditingRow={setEditingRow}
                      />
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
