import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Typography,
  styled,
  TextField,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import { useDropzone } from 'react-dropzone';
import { H4 } from "app/components/Typography";
import { Formik } from "formik";
import { Switch, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import * as Yup from 'yup';
import useAuth from "app/hooks/useAuth";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Collapse from '@mui/material/Collapse';








const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const Form = styled("form")(() => ({ padding: "16px" }));
const StyledTextField = styled(TextField)(() => ({ margin: "8px" }));

const CustomerForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [enableEarlyStopping, setEnableEarlyStopping] = useState(true);
  const [earlyStoppingCriteria, setEarlyStoppingCriteria] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [datasetColumns, setDatasetColumns] = useState([]);
  const [promptSelection, setPromptSelection] = useState('');
  const [outputSelection, setOutputSelection] = useState('');
  const [tokenFun, setTokenFun] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [isPreprocessing, setIsPreprocessing] = useState(false);
  const [preprocessingComplete, setPreprocessingComplete] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Data Validation', 'Preprocessing Data'];
  const [dataValidationComplete, setDataValidationComplete] = useState(false);
  const validationSchema = Yup.object({
    modelSelection: Yup.string().required('Model selection is required'),
    learningRate: Yup.number().required('Learning rate is required'),
    batchSize: Yup.number().required('Batch size is required'),
    epochs: Yup.number().required('Number of epochs is required'),
    description: Yup.string().required('Description is required'),
    // Add other fields as needed
  });
  const [diversityScore, setDiversityScore] = useState(null);
  const [uploadedValidationFiles, setUploadedValidationFiles] = useState([]);
  const [uploadedValidationFileName, setUploadedValidationFileName] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const lrSchedulers = ["ExponentialLR", "CosineAnnealingLR", "ReduceLROnPlateau"]; // Replace with actual PyTorch scheduler names
  const [lrScheduler, setLrScheduler] = useState("");
  const [reduceLROnPlateauMetric, setReduceLROnPlateauMetric] = useState("");

  
  const {user} = useAuth();
  console.log(user)


  
  const handleToggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };
  const handleLrSchedulerChange = (event) => {
    const scheduler = event.target.value;
    setLrScheduler(scheduler);

    // Reset the metric if the scheduler is not ReduceLROnPlateau
    if (scheduler !== "ReduceLROnPlateau") {
      setReduceLROnPlateauMetric("");
    }
  };

  const handleReduceLROnPlateauMetricChange = (event) => {
    setReduceLROnPlateauMetric(event.target.value);
  };


  
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      setDatasetColumns(data.type === 'csv' ? data.columns : data.keys);
      setUploadedFile(file);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handlePromptSelectionChange = (e) => {
    const newPromptSelection = e.target.value;
    setPromptSelection(newPromptSelection);
    if (outputSelection && newPromptSelection) {
      callTokenizeCheckAPI(newPromptSelection, outputSelection);
    }
  };
  
  const handleOutputSelectionChange = (e) => {
    const newOutputSelection = e.target.value;
    setOutputSelection(newOutputSelection);
    if (promptSelection && newOutputSelection) {
        callTokenizeCheckAPI(promptSelection, newOutputSelection);
    }
};
const callDataPreprocessingAPI = async () => {
  setIsPreprocessing(true);
  setPreprocessingComplete(false);
  try {
    const formData = new FormData();
    formData.append('file', uploadedFile);

    const response = await fetch('http://127.0.0.1:5000/data-preprocessing', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      // Update preprocessing steps as done
     
        setIsPreprocessing(false);
        setPreprocessingComplete(true);
        
    
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error during data preprocessing:', error);
  }
};

const callTokenizeCheckAPI = async (prompt, output) => {
  if (!uploadedFile || !prompt || !output) {
      return;
  }

  setIsProcessing(true); // Start processing

  const formData = new FormData();
  formData.append('file', uploadedFile);
  formData.append('prompt', prompt); 
  formData.append('instruct', output); 

  try {
      const response = await fetch('http://127.0.0.1:5000/tokenize-check', {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      setTokenFun(data);
      setDataValidationComplete(true);
      setActiveStep(1);
      callDataPreprocessingAPI();
  } catch (error) {
      console.error('Error:', error);
      setTokenFun("Error processing data");
  } finally {
      setIsProcessing(false); // End processing
  }
};



  const MyDropzone = () => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: '.csv, .json',
      onDrop: acceptedFiles => {
        const file = acceptedFiles[0];
  
        if (file) {
          const fileName = file.name;
          const fileExtension = fileName.split('.').pop().toLowerCase();
  
          if (fileExtension !== 'csv' && fileExtension !== 'json') {
            setErrorMessage('Error: Only CSV or JSON format accepted.');
            return;
          }
  
          handleFileUpload(file);
          setUploadedFiles([file]);
          setUploadedFileName(fileName);
          setSelectedDataset(fileName);
          setErrorMessage(''); // Clear error message
        }
      },
    });
  
    return (
      <div {...getRootProps()} style={{ 
        border: '2px dashed gray', 
        padding: '10px', // Reduced padding
        textAlign: 'center', // Align content to the left
        width: '50%', // Adjust width as needed
        fontSize: '0.8rem' // Smaller text
      }}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some dataset files here, or click to select files</p>
      {errorMessage && (
        <Typography color="error" style={{ marginTop: '10px' }}>{errorMessage}</Typography>
      )}
    </div>
    );
  };

  const callCalculateEmbeddingSimilarityAPI = async (trainingDataset, validationDataset) => {
    console.log(trainingDataset)
    console.log(validationDataset)
    const formData = new FormData();
    formData.append('trainingDataset', trainingDataset);
    formData.append('validationDataset', validationDataset);

    try {
      const response = await fetch('http://127.0.0.1:5000/calculate-similarity', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setDiversityScore(data.similarity_score);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
    const MyValidationDropzone = () => {
      const { getRootProps, getInputProps } = useDropzone({
        accept: '.csv, .json',
        onDrop: async (acceptedFiles) => {
          const file = acceptedFiles[0];
    
          if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
    
            if (fileExtension !== 'csv' && fileExtension !== 'json') {
              setErrorMessage('Error: Only CSV or JSON format accepted.');
              return;
            }
    
            setUploadedValidationFiles([file]);  // Update the state with the uploaded validation file
            setUploadedValidationFileName(fileName);  // Store the file name of the uploaded validation file
    
            // Upload the validation file and then call the Flask API
            const formData = new FormData();
            formData.append('file', file);
    
            try {
              const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
              });
    
              if (!response.ok) {
                throw new Error('Validation file upload failed');
              }
    
              const data = await response.json();
              const validationDatasetPath = data.filePath; // Assuming the server returns the path of the uploaded file
              console.log(uploadedValidationFiles)
    
              // Now call the Flask API with both training and validation dataset paths
              if (uploadedValidationFiles) {  // Check if training dataset is uploaded
                //callCalculateEmbeddingSimilarityAPI(uploadedFile, file);
              }
    
            } catch (error) {
              console.error('Error:', error);
              setErrorMessage('Error uploading validation dataset');
            }
    
            setErrorMessage('');  // Clear any existing error message
          }
        },
      });
  
    return (
      <div {...getRootProps()} style={{ 
        border: '2px dashed gray', 
        padding: '10px', // Reduced padding
        textAlign: 'center', // Align content to the left
        width: '50%', // Adjust width as needed
        fontSize: '0.8rem' // Smaller text
      }}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some dataset files here, or click to select files</p>
      {errorMessage && (
        <Typography color="error" style={{ marginTop: '10px' }}>{errorMessage}</Typography>
      )}
    </div>
    );
  };
  

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Construct the description with form details
      const currentDate = new Date().toISOString();
      const description = `
        Model: ${values.modelSelection}
        Dataset: ${selectedDataset}
        Epochs: ${values.epochs}
        Batch Size: ${values.batchSize}
        Learning Rate: ${values.learningRate}
        Early Stopping: ${enableEarlyStopping ? 'Enabled' : 'Disabled'}
        Early Stopping Criteria: ${earlyStoppingCriteria}
        Description: ${values.description}
        Uploaded Files: ${uploadedFiles.map(file => file.name).join(', ')}
      `;

      const payload = {
        // Replace with your email and API token
        email: "arshdeep.gill01@gmail.com",
        api_token: "ATATT3xFfGF065xS9gFoGtCC1zpe37AqrojqSjxi1ikUla53CEjHihOjnqBzP1aHwiU6D6xjBXNoesQk-nsRfEI8qbugVV6ZuLLXMPzIaD_v001V7ZjsmD1auPxAperY-dnwqQ7UnUdmNpa15WWiGIOLSWe0D6LxnkyWFqm2rRavxVUiRs11Glo=61CF6849",
        project_key: "KAN",
        summary: values.description,
        description: description,
        issuetype: "Task"
    };
    const response = await fetch('http://127.0.0.1:5000/create-jira-issue', {
          method: 'POST',
          mode:"cors",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Jira issue created successfully:', data);
      const jiraIssueKey = data.key;
      console.log("Data to be sent:", {
      dateCreated:currentDate,
      model: values.modelSelection,
      dataset: selectedDataset,
      epochs: values.epochs,
      batchSize: values.batchSize,
      learningRate: values.learningRate,
      earlyStopping: enableEarlyStopping ? 'Enabled' : 'Disabled',
      earlyStoppingCriteria: earlyStoppingCriteria,
      description: values.description,
      uploadedFiles: uploadedFiles.map(file => file.name).join(', '),
      Key:jiraIssueKey
    
    });
    const fineTuneDetails = {
      User_ID:user.email,
      dateCreated: currentDate,
      model: values.modelSelection,
      dataset: selectedDataset,
      epochs: values.epochs,
      batchSize: values.batchSize,
      learningRate: values.learningRate,
      earlyStopping: enableEarlyStopping ? 'Enabled' : 'Disabled',
      earlyStoppingCriteria: earlyStoppingCriteria,
      description: values.description,
      uploadedFiles: uploadedFiles.map(file => file.name).join(', '),
      FineTune_ID: jiraIssueKey,
      Status:"Created",
      date:currentDate
    };
    const bigQueryResponse = await fetch('http://127.0.0.1:5000/add-finetune-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fineTuneDetails)
    });

    if (!bigQueryResponse.ok) {
      throw new Error(`HTTP error! status: ${bigQueryResponse.status}`);
    }

    const bigQueryData = await bigQueryResponse.json();
    console.log(bigQueryData.message);
      navigate("/pages/Request-Details",{
        state: {
          DateSubmitted:currentDate,
          Model: values.modelSelection,
          DataSet: selectedDataset,
          Epochs: values.epochs,
          BatchSize: values.batchSize,
          LearningRate: values.learningRate,
          EarlyStopping: enableEarlyStopping ? 'Enabled' : 'Disabled',
          EarlyStoppingCriteria: earlyStoppingCriteria,
          Description: values.description,
          uploadedFiles: uploadedFiles.map(file => file.name).join(', '),
          FineTune_ID: jiraIssueKey,
          Status:"Created"
        }
      }
      );
    } catch (error) {
      console.error('Error creating Jira issue:', error);
    }

    setSubmitting(false);
  };

      
  const handleEarlyStoppingChange = (event) => {
    setEnableEarlyStopping(event.target.checked);
  };

  const handleEarlyStoppingCriteriaChange = (event) => {
    setEarlyStoppingCriteria(event.target.value);
  };



  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "LLM Fine-tune", path: "/fine-tune" }]} />
      </div>

      <Card elevation={3}>
        <H4 p={2}>Create New LLM Fine-tune Request</H4>
        <Divider sx={{ mb: 1 }} />

        <Formik initialValues={initialValues} validationSchema={validationSchema} 
         onSubmit={handleSubmit} enableReinitialize={true}>
          {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="center">
                {/* Model Selection */}
                <Grid item md={2} sm={4} xs={12}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1">Model Selection</Typography>
                    <Tooltip title="Choose a model. E.g., Model 1, Model 2, etc.">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <StyledTextField
                    select
                    size="small"
                    name="modelSelection"
                    label="Select Model"
                    variant="outlined"
                    sx={{ minWidth: 188 }}
                    value={values.modelSelection || ""}
                    onChange={handleChange}
                    error={Boolean(touched.modelSelection && errors.modelSelection)}
                    helperText={touched.modelSelection && errors.modelSelection}
                  >
                    {modelList.map((model, ind) => (
                      <MenuItem value={model} key={ind}>{model}</MenuItem>
                    ))}
                  </StyledTextField>
                </Grid>

                {/* Dataset Selection */}
                <Grid item md={2} sm={4} xs={12}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1">Dataset Selection</Typography>
                    <Tooltip title='Dataset Should be like :{
  "prompt": "Rewrite this sentence in Spanish - \"All the students are in the classroom.\"",
  "output": "Todos los estudiantes están en el aula.",
  "metadata": {
    // Any additional metadata
  }
}
{
  "prompt": "Rewrite this sentence in Spanish - \"If you believe, you can make it happen.\"",
  "output": "Si crees, puedes hacer que suceda.",
  "metadata": {
    // Any additional metadata
  }
}'>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
                {/* <Grid item md={10} sm={8} xs={12}>
                  <StyledTextField
                    select
                    size="small"
                    name="datasetSelection"
                    label="Select Dataset"
                    variant="outlined"
                    sx={{ minWidth: 188 }}
                    value={selectedDataset}
                    onChange={handleDatasetChange}
                  >
                    {datasetList.map((dataset, ind) => (
                      <MenuItem value={dataset} key={ind}>{dataset}</MenuItem>
                    ))}
                  </StyledTextField>
                </Grid> */}

                {/* Drag and Drop Upload */}
                <Grid item xs={12}>
                <MyDropzone />
                {uploadedFileName && (
                  <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                    Uploaded File: {uploadedFileName}
                  </Typography>
                )}
              </Grid>


              {datasetColumns.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <StyledTextField
              select
              label="Select Prompt Column"
              fullWidth
              value={promptSelection}
              onChange={handlePromptSelectionChange}
            >
              {datasetColumns.map((col, index) => (
                <MenuItem key={index} value={col}>{col}</MenuItem>
              ))}
            </StyledTextField>
          </Grid>
          <Grid item xs={6}>
            <StyledTextField
              select
              label="Select Output Column"
              fullWidth
              value={outputSelection}
              onChange={handleOutputSelectionChange}
            >
              {datasetColumns.map((col, index) => (
                <MenuItem key={index} value={col}>{col}</MenuItem>
              ))}
            </StyledTextField>
          </Grid>
          {/* {tokenFun && (
            <Grid item xs={12} style={{ marginTop: '10px', paddingLeft: '50px' }}>
              <Typography color="primary">{tokenFun}</Typography>
            </Grid>
          )} */}
        </Grid>
      )}
      {dataValidationComplete ? (
  <Grid item xs={12} style={{ textAlign: 'left' }}>
    <CheckCircleIcon color="success" />
    <Typography variant="subtitle1" style={{ marginTop: '10px' }} color="primary" >
      Data validated
    </Typography>
  </Grid>
) : isProcessing && (
  <Grid item xs={12} style={{ textAlign: 'center' }}>
    <CircularProgress />
    <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
      Validating data...
    </Typography>
  </Grid>
)}
{preprocessingComplete ? (
  <Grid item xs={12} style={{ textAlign: 'Left' }}>
    <CheckCircleIcon color="success" />
    <Typography variant="subtitle1" style={{ marginTop: '10px' }} color="primary">
      Data preprocessed
    </Typography>
  </Grid>
) : isPreprocessing && (
  <Grid item xs={12} style={{ textAlign: 'center' }}>
    <CircularProgress />
    <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
      Preprocessing dataset...
    </Typography>
  </Grid>
)}       {/* Validation datset */}
        <Grid item md={2} sm={4} xs={12}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1">Validation Dataset Selection</Typography>
                    <Tooltip title='Dataset Should be like :{
  "prompt": "Rewrite this sentence in Spanish - \"All the students are in the classroom.\"",
  "output": "Todos los estudiantes están en el aula.",
  "metadata": {
    // Any additional metadata
  }
}
{
  "prompt": "Rewrite this sentence in Spanish - \"If you believe, you can make it happen.\"",
  "output": "Si crees, puedes hacer que suceda.",
  "metadata": {
    // Any additional metadata
  }
}'>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={12}>
  <MyValidationDropzone />
  {uploadedValidationFileName && (
    <Typography variant="subtitle1" style={{ marginTop: '10px' }} >
      Uploaded Validation File: {uploadedValidationFileName}
    </Typography>
  )}
  {diversityScore !== null && (
    <Typography variant="subtitle1" style={{ marginTop: '10px' }} color="primary" >
      Diversity Score: {diversityScore}
    </Typography>
  )}
</Grid>

                {/* Number of Epochs */}
                <Grid item md={2} sm={4} xs={12}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1">Epochs</Typography>
                    <Tooltip title="Not More than 3 Epochs">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <StyledTextField
                    size="small"
                    name="epochs"
                    label="Number of Epochs"
                    type="number"
                    variant="outlined"
                    value={values.epochs}
                    onChange={handleChange}
                    error={Boolean(touched.epochs && errors.epochs)}
                    helperText={touched.epochs && errors.epochs}
                  />
                  {values.epochs > 4 && (
                    <Typography color="error" style={{ marginTop: '10px' }}>
                      Warning: More than 4 Epochs are not recommended.
                    </Typography>
                  )}
                </Grid>
                {/* Batch Size */}
                <Grid item md={2} sm={4} xs={12}>
                  Batch Size
                </Grid>
                <Grid item md={10} sm={8} xs={12}>
                  <StyledTextField
                    size="small"
                    name="batchSize"
                    label="Batch Size"
                    type="number"
                    variant="outlined"
                    value={values.batchSize}
                    onChange={handleChange}
                    error={Boolean(touched.batchSize && errors.batchSize)}
                    helperText={touched.batchSize && errors.batchSize}
                  />
                                  {values.batchSize > 4 && (
                    <Typography color="error" style={{ marginTop: '10px' }}>
                      Warning: Batch size more than 4 is not recommended.
                    </Typography>
                  )}
                </Grid>
                  
                {/* Early Stopping Toggle */}
              <Grid item md={2} sm={4} xs={12}>
                Early Stopping
              </Grid>
              <Grid item md={10} sm={8} xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enableEarlyStopping}
                      onChange={handleEarlyStoppingChange}
                    />
                  }
                  label={enableEarlyStopping ? "Enabled" : "Disabled"}
                />
              </Grid>
              {/* Early Stopping Criteria */}
              {enableEarlyStopping && (
                <React.Fragment>
                  <Grid item md={2} sm={4} xs={12}>
                    Stopping Criteria
                  </Grid>
                  <Grid item md={10} sm={8} xs={12}>
                    <StyledTextField
                      select
                      size="small"
                      name="earlyStoppingCriteria"
                      label="Criteria"
                      variant="outlined"
                      value={earlyStoppingCriteria}
                      onChange={handleEarlyStoppingCriteriaChange}
                    >
                      <MenuItem value="loss">Loss</MenuItem>
                      <MenuItem value="accuracy">Accuracy</MenuItem>
                      {/* Add other criteria as needed */}
                    </StyledTextField>
                  </Grid>
                </React.Fragment>
              )}
              <Grid item md={2} sm={4} xs={12}>
              <Button onClick={handleToggleAdvanced} color="primary">
    {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
  </Button></Grid>
  <Collapse in={showAdvanced}>
    <Grid container spacing={3}>
      {/* Learning Rate */}
      <Grid item md={6} xs={12}>
        <StyledTextField
          size="small"
          name="learningRate"
          label="Learning Rate"
          type="number"
          variant="outlined"
          value={values.learningRate}
          onChange={handleChange}
          error={Boolean(touched.learningRate && errors.learningRate)}
          helperText={touched.learningRate && errors.learningRate}
        />
      </Grid>
      {/* Learning Rate Scheduler */}
      <Grid item md={6} xs={12}>
        <StyledTextField
          select
          size="small"
          name="lrScheduler"
          label="Learning Rate Scheduler"
          variant="outlined"
          value={values.lrScheduler}
          onChange={handleLrSchedulerChange}
        >
          {lrSchedulers.map((scheduler, index) => (
            <MenuItem key={index} value={scheduler}>{scheduler}</MenuItem>
          ))}
        </StyledTextField>
      </Grid>
    </Grid>
    {lrScheduler === "ReduceLROnPlateau" && (
        <Grid item md={6} xs={12}>
          <StyledTextField
            select
            size="small"
            name="reduceLROnPlateauMetric"
            label="Metric for ReduceLROnPlateau"
            variant="outlined"
            value={reduceLROnPlateauMetric}
            onChange={handleReduceLROnPlateauMetricChange}
          >
            {/* Define your metrics options here */}
            <MenuItem value="val_loss">Validation Loss</MenuItem>
            <MenuItem value="val_accuracy">Validation Accuracy</MenuItem>
            {/* Add other metrics as needed */}
          </StyledTextField>
        </Grid>
      )}
  </Collapse>

              {/* Description Field */}
              <Grid item xs={12}>
                <TextField
                  label="Description of Fine-tune Request"
                  name="description"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={values.description}
                  onChange={handleChange}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>

                {/* ... other form fields ... */}

                <Box mt={3}>
                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                  Submit Fine-tune Request
                </Button>
              </Box>
              </Grid>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

const modelList = [ "Instruct", "Chat"];
const datasetList = ["Dataset 1", "Dataset 2", "Dataset 3"];
const initialValues = {
  modelSelection: "",
  learningRate: 0.001,
  batchSize: 3,
  epochs: 2,
  // ... other initial values for hyperparameters ...
};

export default CustomerForm;
