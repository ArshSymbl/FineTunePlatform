import React from 'react';
import { Box, Button, Card, Checkbox, Grid, Icon, styled } from "@mui/material";
import { FlexAlignCenter, FlexBetween, FlexBox } from "app/components/FlexBox";
import { Paragraph, Small } from "app/components/Typography";

// styled components
const StyledIcon = styled(Icon)({
  color: "#fff",
  cursor: "pointer",
  marginRight: "12px",
});

const IMG = styled("img")({
  width: "100%",
  height: "200px", // Adjust this value as needed
  display: "block",
  objectFit: "cover", // Ensures the image covers the area, cropping if necessary
});

const CardRoot = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "& .grid__card-overlay": {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    opacity: 0,
    transition: "all 250ms ease-in-out",
    background: "rgba(0, 0, 0, 0.67)",
    "& > div:nth-of-type(2)": {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: -1,
    },
  },
  "& .grid__card-top": {
    textAlign: "center",
    position: "relative",
  },
  "& .grid__card-bottom": {
    textAlign: "center",
    "& .email": { display: "none" },
  },
  "&:hover": {
    "& .grid__card-overlay": { opacity: 1 },
    "& .grid__card-bottom": {
      "& small": {
        display: "none",
        color: theme.palette.text.secondary,
      },
    },
  },
}));

const calculateColumnPerRow = (value) => {
  if (value === 25) return 2;
  if (value === 50) return 3;
  if (value === 75) return 4;
  if (value === 100) return 6;
};

const GridView = ({ list = [], sliderValue }) => {
  return (
    <div>
      <Grid container spacing={2}>
        {list.map((model) => (
          <Grid item key={model.id} sm={calculateColumnPerRow(sliderValue)}>
            <CardRoot elevation={6}>
              <Box className="grid__card-top">
                <IMG src={model.modelImage} alt={model.modelName} onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150"; }} />

                <Box className="grid__card-overlay">
                  {/* Overlay components like Checkbox, Icons, etc. */}
                  <FlexBetween>
                    <Checkbox sx={{ color: "#fff" }}></Checkbox>
                    <FlexBox alignItems="center">
                      {/* Icons for actions like edit, delete, etc. */}
                    </FlexBox>
                  </FlexBetween>

                  <FlexAlignCenter>
                    <Button variant="outlined" sx={{ color: "#fff", borderColor: "#fff" }}>
                      View Details
                    </Button>
                  </FlexAlignCenter>
                </Box>
              </Box>

              <Box py={1} className="grid__card-bottom">
                <Paragraph>{model.modelName}</Paragraph>
                <Small sx={{ display: "block" }}>{model.modelDescription}</Small>
                <Small sx={{ display: "none" }}>{model.lastUpdated}</Small>
              </Box>
            </CardRoot>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default GridView;
