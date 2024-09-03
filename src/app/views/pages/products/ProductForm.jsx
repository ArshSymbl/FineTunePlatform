import React, { useState, useEffect } from "react";
import { 
  Box, Button, Card, Divider, Grid, MenuItem, styled, TextField, 
  FormControl, InputLabel, Select, OutlinedInput, Chip 
} from "@mui/material";
import { Breadcrumb } from "app/components";
import { H4 } from "app/components/Typography";
import { useDropzone } from "react-dropzone";
import { Formik } from "formik";
import * as yup from "yup";

// Styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const StyledTextField = styled(TextField)({ marginBottom: "16px" });
const Form = styled("form")({ paddingLeft: "16px", paddingRight: "16px" });

const DropZone = styled("div")(({ isDragActive, theme }) => ({
  height: 160,
  width: "100%",
  cursor: "pointer",
  borderRadius: "4px",
  marginBottom: "16px",
  transition: "all 350ms ease-in-out",
  border: `2px dashed rgba(${theme.palette.text.primary}, 0.3)`,
  "&:hover": {
    background: `${theme.palette.action.hover}`,
  },
  background: isDragActive ? theme.palette.action.selected : theme.palette.background.default,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
}));

const DatasetUploadForm = () => {
  const [filesList, setFilesList] = useState([]);
  const modelsList = ["Model 1", "Model 2", "Model 3"]; // Example models list

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: { "text/csv": [".csv"], "application/vnd.ms-excel": [".xls", ".xlsx"] },
  });

  useEffect(() => {
    setFilesList(acceptedFiles);
  }, [acceptedFiles]);

  const handleSubmit = async (values) => {
    console.log(values, filesList);
    // Additional logic to handle file submission
  };

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Dashboard", path: "/dashboard" }, { name: "Upload Dataset" }]} />
      </div>

      <Card elevation={3}>
        <Box p={2} display="flex">
          <H4>Upload New Dataset</H4>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Formik
          initialValues={initialValues}
          validationSchema={datasetSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    name="datasetName"
                    label="Dataset Name"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.datasetName || ""}
                  />
                </Grid>

                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    name="description"
                    label="Description"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description || ""}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Models</InputLabel>
                    <Select
                      multiple
                      value={values.models}
                      onChange={(event) => setFieldValue('models', event.target.value)}
                      input={<OutlinedInput label="Models" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {modelsList.map((model) => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <DropZone {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop dataset files here, or click to select files</p>
                    {filesList.length > 0 && (
                      <div>
                        {filesList.map((file) => (
                          <p key={file.path}>{file.path}</p>
                        ))}
                      </div>
                    )}
                  </DropZone>
                </Grid>
              </Grid>

              <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }}>
                Submit Dataset
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

const datasetSchema = yup.object().shape({
  datasetName: yup.string().required("Dataset name is required"),
  description: yup.string().required("Description is required"),
  models: yup.array().of(yup.string()).required("Select at least one model"),
  // Add additional validation rules here
});

const initialValues = {
  datasetName: "",
  description: "",
  models: [],
  // Initial values for other fields
};

export default DatasetUploadForm;
