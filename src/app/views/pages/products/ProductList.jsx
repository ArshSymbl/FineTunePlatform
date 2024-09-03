import React, { useState } from "react";
import { Link } from 'react-router-dom';
import {
  Box, Card, Divider, FormControl, Grid, Paper, styled, Table, TableBody, TableCell, TableRow, Checkbox, Typography
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import { Breadcrumb } from "app/components";
import { TableHead, TableToolbar } from "app/components/data-table";
import { getComparator, stableSort } from "app/components/data-table/utils";
import useTable from "app/hooks/useTable";
import { useNavigate } from "react-router-dom";

// Styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: {
    margin: "16px",
  },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const StatusText = styled(Typography)(({ status }) => ({
  color: status === 'Active' ? 'green' : status === 'Archived' ? 'gray' : status === 'Pending' ? 'orange' : 'blue',
  fontWeight: 'bold',
}));

const FineTuneList = () => {
  const {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    isSelected,
    handleClick,
    handleChangePage,
    handleRequestSort,
    handleSelectAllClick,
    handleChangeRowsPerPage,
  } = useTable({ defaultOrderBy: "modelName" });

  const navigate = useNavigate();

  const fineTuneRequests = [
    { id: 1, name: 'Dataset 1', status: 'Active', modifiedDate: '2023-03-10', objective: 'Objective 1' },
    { id: 2, name: 'Dataset 2', status: 'Archived', modifiedDate: '2023-03-11', objective: 'Objective 2' },
    // ... more datasets ...
  ];

  const columns = [
    { id: "name", align: "left", disablePadding: false, label: "Dataset Name" },
    { id: "status", align: "center", disablePadding: false, label: "Status" },
    { id: "modifiedDate", align: "center", disablePadding: false, label: "Last Modified" },
    { id: "Description", align: "center", disablePadding: false, label: "Description" },
    { id: "details", align: "center", disablePadding: false, label: "Details" }
  ];

  return (
    <Container>
      <Breadcrumb
        routeSegments={[{ name: "Dashboard", path: "/dashboard" }, { name: "Fine Tune Requests" }]}
      />

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbar title="Fine Tune Requests" numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              order={order}
              orderBy={orderBy}
              headCells={columns}
              numSelected={selected.length}
              rowCount={fineTuneRequests.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {stableSort(fineTuneRequests, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                      onClick={(event) => handleClick(event, row.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="center">
                        <StatusText status={row.status}>{row.status}</StatusText>
                      </TableCell>
                      <TableCell align="center">{row.modifiedDate}</TableCell>
                      <TableCell align="center">{row.objective}</TableCell>
                      <TableCell align="center">
                        <Link to={`/dataset-details/${row.id}`} style={{ textDecoration: 'none' }}>
                          <IconButton>
                            <Typography component="span">→</Typography>
                          </IconButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={fineTuneRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default FineTuneList;
