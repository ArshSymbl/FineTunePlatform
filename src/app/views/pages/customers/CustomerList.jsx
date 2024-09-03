import { TableHead, TableToolbar } from "app/components/data-table";
import React, { useEffect, useState } from "react";
import {
  Box, Button, Card, Divider, FormControl, FormControlLabel, Grid, MenuItem,
  Paper, styled, Table, TableBody, TableCell, TableRow, Checkbox,
  TableContainer, TablePagination, IconButton
} from "@mui/material";
import { Edit, TrendingFlat } from "@mui/icons-material";
import { Breadcrumb } from "app/components";
import { H5 } from "app/components/Typography";
import useTable from "app/hooks/useTable";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import useAuth from "app/hooks/useAuth";

const IMG = styled("img")({ height: 32, borderRadius: "4px" });
const FlexBox = styled(Box)({ display: "flex", alignItems: "center" });

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": { marginBottom: "30px", [theme.breakpoints.down("sm")]: { marginBottom: "16px" } },
}));

const FineTuneList = () => {
  const {user} = useAuth();
  
  const [fineTuneRequests, setFineTuneRequests] = useState([]);
  const navigate = useNavigate();

  const {
    page, order, orderBy, selected, rowsPerPage,
    isSelected, handleClick, handleChangePage,
    handleRequestSort, handleSelectAllClick, handleChangeRowsPerPage
  } = useTable({ defaultOrderBy: "modelName" });

  useEffect(() => {
    const url = new URL('http://127.0.0.1:5000/get-finetune-requests');
      url.searchParams.append('userId', user.email);

      fetch(url.toString())
        .then(response => response.json())
        .then(data => setFineTuneRequests(data))
        .catch(error => console.error('Error:', error));
  }, []);

  const handleRowClick = (row) => {
    navigate("/pages/Request-Details", { state: row });
  };
  const truncateText = (text) => {
    const maxLength = 10;
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Define columns for the table
  const columns = [
    { id: "requestId", align: "left", disablePadding: true, label: "FineTune ID" },
    { id: "modelName", align: "center", disablePadding: false, label: "Model Name" },
    { id: "status", align: "center", disablePadding: false, label: "Status" },
    { id: "dateSubmitted", align: "center", disablePadding: false, label: "Date Submitted" },
    { id: "description", align: "center", disablePadding: false, label: "Description" },
    { id: "details", align: "center", disablePadding: false, label: "Details" },
  ];

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Dashboard", path: "/dashboard" }, { name: "Fine Tune Requests" }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        {/* TableToolbar and other components */}

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
              {fineTuneRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row.requestId);
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.requestId}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                    onClick={(event) => handleClick(event, row.requestId)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    <TableCell align="center">{row.FineTune_ID}</TableCell>
                    <TableCell align="center">{row.Model}</TableCell>
                    <TableCell align="center">{row.Status}</TableCell>
                    <TableCell align="center">{row.DateSubmitted}</TableCell>
                    <TableCell align="center">{truncateText(row.Description)}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleRowClick(row)}>
                        <TrendingFlat />
                      </IconButton>
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





