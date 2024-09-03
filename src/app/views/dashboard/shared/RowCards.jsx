import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  styled,
  Typography
} from "@mui/material";
import { format } from "date-fns";

const StyledCard = styled(Card)(() => ({
  padding: '16px',
  margin: '8px 0',
}));

const DatasetName = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
}));

const DatasetInfo = styled(Typography)(() => ({
  color: 'gray',
  fontSize: '0.9rem',
}));

const StatusText = styled(Typography)(({ status }) => ({
  color: status === 'Active' ? 'green' : status === 'Archived' ? 'gray' : status === 'Pending' ? 'orange' : 'blue',
  fontWeight: 'bold',
}));

const RowCards = () => {
  const datasets = [
    { id: 1, name: 'Dataset 1', description: 'Description 1', size: '10GB', modifiedDate: new Date(), status: 'Active' },
    { id: 2, name: 'Dataset 2', description: 'Description 2', size: '20GB', modifiedDate: new Date(), status: 'Archived' },
    { id: 3, name: 'Dataset 3', description: 'Description 3', size: '15GB', modifiedDate: new Date(), status: 'In Review' },
    { id: 4, name: 'Dataset 4', description: 'Description 4', size: '5GB', modifiedDate: new Date(), status: 'Active' },
    { id: 5, name: 'Dataset 5', description: 'Description 5', size: '8GB', modifiedDate: new Date(), status: 'Pending' },
  ];

  return (
    <>
      {datasets.map((dataset) => (
        <StyledCard key={dataset.id}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column">
                <DatasetName>{dataset.name}</DatasetName>
                <Link to={`/dataset-details/${dataset.id}`} style={{ textDecoration: 'none' }}>
                  <DatasetInfo>{dataset.description}</DatasetInfo>
                </Link>
              </Box>
            </Grid>

            <Grid item xs={4} sm={2}>
              <DatasetInfo>{`Size: ${dataset.size}`}</DatasetInfo>
            </Grid>

            <Grid item xs={4} sm={2}>
              <DatasetInfo>{`Last Used: ${format(dataset.modifiedDate, "MM/dd/yyyy")}`}</DatasetInfo>
            </Grid>

            <Grid item xs={4} sm={4}>
            <Box display="flex" justifyContent="space-between">
            <Box flexBasis="50%"></Box> {/* Empty Box for Spacing */}
              <StatusText status={dataset.status}>{`Status: ${dataset.status}`}</StatusText>
              </Box>
            </Grid>
          </Grid>
        </StyledCard>
      ))}
    </>
  );
};

export default RowCards;
