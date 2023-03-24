import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./datatable.css";
import { BiSearchAlt2 } from "react-icons/bi";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "approval",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`table-status ${params.row.approval}`}>
          {params.row.approval}
        </div>
      );
    },
  },
  { field: "schoolID", headerName: "School-ID", width: 150 },
  {
    field: "fullname",
    headerName: "Full Name",
    width: 300,
    renderCell: (params) => {
      return (
        <>
          <span>{`${params.row.lname} ${params.row.fname}, ${params.row.mname}`}</span>
        </>
      );
    },
  },

  {
    field: "document",
    headerName: "Document Requested",
    width: 250,
  },
  {
    field: "requestDate",
    headerName: "Date Requested",
    width: 200,
  },
  { field: "course", headerName: "Course", width: 600 },
];

function DataTable({ props, title, actionColumn }) {
  const [searchValue, setSearchValue] = useState("");
  const filter = props.filter((row) => {
    const fullName = `${row.lname} ${row.fname} ${row.mname}`.toLowerCase();
    return (
      row.lname.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.fname.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.mname.toLowerCase().includes(searchValue.toLowerCase()) ||
      fullName.includes(searchValue.toLowerCase())
    );
  });

  return (
    <div className="admin-dataTable">
      <div>
        <h1>{title}</h1>
      </div>
      <div className="search-container">
        <input
          className="admin-search-input"
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <BiSearchAlt2 className="admin-search-icon" />
      </div>
      <DataGrid
        className="myTable"
        rows={filter}
        columns={actionColumn.concat(columns)}
        rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        style={{ textAlign: "center" }}
        getRowId={(row) => row.id}
        search={searchValue}
        searchField="lname"
        onSearch={setSearchValue}
      />
    </div>
  );
}

export default DataTable;
