import React,{ useEffect,useState } from 'react';
import { Breadcrumb } from "app/components";
import { useLocation } from 'react-router-dom';
import {
  Box, Typography, Link, Card, CardContent, styled, Grid, Paper,
  Step, Stepper, StepLabel,Button
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ModelIcon from '@mui/icons-material/Extension'; // Example icon for Model
import DataArrayIcon from '@mui/icons-material/DataArray'; // Example icon for Dataset
import KeyIcon from '@mui/icons-material/VpnKey'; // Icon for Jira Issue Key
import RefreshIcon from '@mui/icons-material/Refresh'; // Icon for Refresh Button

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiCardContent-root': {
    paddingBottom: theme.spacing(2),
  },
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  padding: theme.spacing(3, 0),
}));

const steps = ['Created', 'Unde Review', 'In Progress', 'Complete'];
const statusToStepIndex = (status) => {
  const indexMap = {
    'Created': 0,
    'Under Review': 1,
    'In Progress': 2,
    'Complete': 3
  };
  return indexMap[status] || 0;
};

const FineTuneDetailsViewer = () => {
  const location = useLocation();
  const initialDetails= location.state || {
    currentStep: 0,
    dateCreated: '',
    model: '',
    dataset: '',
    epochs: '',
    batchSize: '',
    learningRate: '',
    earlyStopping: '',
    earlyStoppingCriteria: '',
    description: '',
    jiraIssueKey: '',
    status: 'Created',
    resultLink: '',
    comments: [] // Initialize comments as an empty array
  };
  const [fineTuneRequestDetails, setFineTuneRequestDetails] = useState({
    ...initialDetails,
    currentStep: statusToStepIndex(initialDetails.status),
  });
  useEffect(() => {
    console.log("Fine Tune Request Details:", fineTuneRequestDetails);
  }, [fineTuneRequestDetails]); 
  useEffect(() => {
    if (location.state) {
      setFineTuneRequestDetails({
        ...location.state,
        currentStep: statusToStepIndex(location.state.Status),
      });
    }
  }, [location.state]);

  useEffect(() => {
    console.log("Fine Tune Request Details:", fineTuneRequestDetails);
  }, [fineTuneRequestDetails]); 


  const handleRefreshStatus = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-jira-issue/${fineTuneRequestDetails.FineTune_ID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      let updatedStatus = data.assignee ? 'Under Review' : 'Created';
      
      if (data.assignee) {
        updatedStatus = data.status === 'To Do' ? 'Under Review' : 
                        (data.status === 'In Progress' ? 'In Progress' : 
                         (data.status === 'Done' ? 'Complete' : fineTuneRequestDetails.Status));
      }
      if (updatedStatus !== fineTuneRequestDetails.status) {
        // Status has changed, update it in BigQuery
        const updateResponse = await fetch(`http://127.0.0.1:5000/update-finetune-details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            FineTune_ID: fineTuneRequestDetails.FineTune_ID,
            Status: updatedStatus
          })
        });
  
        if (!updateResponse.ok) {
          throw new Error(`HTTP error! status: ${updateResponse.status}`);
        }
  
        const updateData = await updateResponse.json();
        console.log(updateData.message);
      }

      console.log(data.comments)
      setFineTuneRequestDetails({ ...fineTuneRequestDetails, Status: updatedStatus,currentStep: statusToStepIndex(updatedStatus),comments: data.comments });
      

    } 
    
    catch (error) {
      console.error('Error fetching Jira issue status:', error);
    }
  };



  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Dashboard', path: '/dashboard' }, { name: 'Fine Tune Details' }]} />
      </div>
  
      <StyledCard>
        <CardContent>
          <Typography variant="h6" mb={2}>Progress</Typography>
          <StyledStepper activeStep={fineTuneRequestDetails.currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </StyledStepper>
        </CardContent>
      </StyledCard>
  
      {/* Date Created */}
      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6"><CalendarTodayIcon color="primary" sx={{ mr: 1 }} />Date Created</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{
    new Date(fineTuneRequestDetails.DateSubmitted).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }</Typography>
      </AccordionDetails>
    </Accordion>
  
      {/* ID and Status */}
      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <KeyIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">ID and Status</Typography>
          </Box>
          <Typography><b>Request ID:</b> {fineTuneRequestDetails.FineTune_ID}</Typography>
          <Typography><b>Status:</b> {fineTuneRequestDetails.Status}</Typography>
          <Button variant="contained" color="primary" startIcon={<RefreshIcon />} onClick={handleRefreshStatus} sx={{ mt: 2 }}>
          Update Status & Check Notifications
          </Button>
          {
  fineTuneRequestDetails.comments && fineTuneRequestDetails.comments.length > 0 && (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6">Comments From AI Team</Typography>
        </Box>
        {fineTuneRequestDetails.comments.map((comment, index) => (
          <Typography key={index} sx={{ mb: 1 }}>
            {comment}
          </Typography>
        ))}
      </CardContent>
    </StyledCard>
  )
}
        </CardContent>
      </StyledCard>
  
      {/* Model and Dataset */}
      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6"><ModelIcon color="primary" sx={{ mr: 1 }} />Model and Dataset</Typography>
      </AccordionSummary>
      <AccordionDetails>
          <Typography><b>Model:</b> {fineTuneRequestDetails.Model}</Typography>
          <Typography><b>Dataset:</b> {fineTuneRequestDetails.DataSet}</Typography>
          </AccordionDetails>
          </Accordion>
  
      {/* Training Details */}
      <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6"><DataArrayIcon color="primary" sx={{ mr: 1 }} />Training Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
          <Typography><b>Epochs:</b> {fineTuneRequestDetails.Epochs}</Typography>
          <Typography><b>Batch Size:</b> {fineTuneRequestDetails.BatchSize}</Typography>
          <Typography><b>Learning Rate:</b> {fineTuneRequestDetails.LearningRate}</Typography>
          <Typography><b>Early Stopping:</b> {fineTuneRequestDetails.EarlyStopping}</Typography>
          <Typography><b>Early Stopping Criteria:</b> {fineTuneRequestDetails.EarlyStoppingCriteria}</Typography>
          </AccordionDetails>
          </Accordion>
  
      {/* Description */}
      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <InfoIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Description</Typography>
          </Box>
          <Typography>{fineTuneRequestDetails.Description}</Typography>
        </CardContent>
      </StyledCard>
  
      {/* Results */}
      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <DownloadIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Results</Typography>
          </Box>
          <Link href="/assets/images/illustrations/Nebula Fine Tuning Report - Structurely -v2.pdf" download>Download Fine-Tune Results</Link>
        </CardContent>
      </StyledCard>
    </Container>
  );
  
};

export default FineTuneDetailsViewer;
