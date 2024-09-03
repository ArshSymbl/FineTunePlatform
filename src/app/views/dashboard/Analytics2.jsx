import { styled, Button } from "@mui/material";
import React from "react";

const AnalyticsRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative', // Required for absolute positioning of child elements
  alignItems: 'flex-start', // Align to the top
  justifyContent: 'flex-end', // Align to the right
  minHeight: '100vh',
  padding: '28px 32px 86px 32px',
  background: `url('/assets/images/illustrations/Improve-performance-of-your-Large-Language-Models-1280x731.png') no-repeat center center`,
  backgroundSize: 'cover',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  right: '20px', // Align with the image
  bottom: '660px', // Position above the image
  padding: theme.spacing(2), // Larger button size
  fontSize: '1.2rem', // Larger font size
}));

const BottomRightImage = styled('img')({
  position: 'absolute',
  right: '20px', // Moved slightly to the left
  bottom: '100px', // Moved slightly up
  maxWidth: '700px', // Further enlarged
  maxHeight: '700px', // Further enlarged
});

const Analytics = () => {
  return (
    <AnalyticsRoot>
      <StyledButton 
        variant="contained" 
        color="primary" 
        href="/pages/new-jobRequest"
        size="large" // Make the button large
      >
        Make First Fine-Tune Request
      </StyledButton>

      <BottomRightImage 
        src="/assets/images/illustrations/Fine-tunning.png" 
        alt="Fine Tuning"
      />
    </AnalyticsRoot>
  );
};

export default Analytics;
