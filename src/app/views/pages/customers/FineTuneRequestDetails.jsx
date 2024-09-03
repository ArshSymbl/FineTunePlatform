import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, Typography, CircularProgress } from '@mui/material';

// Mock function to simulate fetching data. Replace this with your actual API call.
const fetchRequestDetails = async (requestId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        requestId: requestId,
        modelName: `Model Name for ${requestId}`,
        status: 'Completed',
        dateSubmitted: '2023-03-15',
        objective: `Objective for ${requestId}`,
        // ... other details
      });
    }, 1000);
  });
};

const FineTuneRequestDetails = () => {
  const { requestId } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchRequestDetails(requestId);
        setDetails(response);
      } catch (error) {
        console.error('Error fetching details:', error);
        // Handle error appropriately
      }
      setLoading(false);
    };

    getDetails();
  }, [requestId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!details) {
    return <Typography>No details found for request ID: {requestId}</Typography>;
  }

  return (
    <Card sx={{ p: 3, m: 2 }}>
      <Typography variant="h4">Fine-Tune Request Details</Typography>
      <Box mt={2}>
        <Typography><b>Request ID:</b> {details.requestId}</Typography>
        <Typography><b>Model Name:</b> {details.modelName}</Typography>
        <Typography><b>Status:</b> {details.status}</Typography>
        <Typography><b>Date Submitted:</b> {details.dateSubmitted}</Typography>
        <Typography><b>Objective:</b> {details.objective}</Typography>
        {/* Display other details here */}
      </Box>
    </Card>
  );
};

export default FineTuneRequestDetails;
