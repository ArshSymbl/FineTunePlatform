import { Card, Grid, styled, useTheme } from "@mui/material";
import { useState, useEffect,Fragment } from "react";
import Campaigns from "./shared/RecentUpdates";
import DoughnutChart from "./shared/Doughnut";
import ModifiedAreaChart from "./shared/ModifiedAreaChart";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";

import TopSellingTable from "./shared/TopSellingTable";
import UpgradeCard from "./shared/UpgradeCard";
import RecentUpdates from "./shared/RecentUpdates";
import { Button } from '@mui/material';


const AnalyticsRoot = styled("div")(({ theme }) => ({
  padding: "28px 32px 86px 32px",
  background: theme.palette.primary.main,
}));

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  marginTop: "-72px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize",
}));

const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

const Header = styled(Title)(() => ({
  marginBottom: 2,
  color: "rgba(255, 255, 255, 0.87)",
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "16px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
}));

const IframeContainer = styled("div")(({ theme }) => ({
  width: "100%",
  height: "400px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  overflow: "hidden",
  marginTop: "20px",
}));

const Analytics = () => {
  const { palette } = useTheme();
  const [tensorBoardRunning, setTensorBoardRunning] = useState(false);

  useEffect(() => {
    // Start TensorBoard when the component mounts
    handleTensorBoardStart();
  }, []);

  const handleTensorBoardStart = () => {
    fetch(`http://127.0.0.1:5000/start-tensorboard`, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTensorBoardRunning(true);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const openTensorBoard = () => {
    window.open('http://localhost:6006', '_blank');
  };

  return (
    <Fragment>
  
  <AnalyticsRoot>
        <Header>Last FineTune Request Details</Header>
        {tensorBoardRunning && (
          <Fragment>
            <IframeContainer>
              <iframe
                src="https://localhost:6006"
                width="100%"
                height="400"
                frameBorder="0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </IframeContainer>
            <Button
              variant="contained"
              style={{ marginTop: '50px', backgroundColor: 'white', color: 'black' }}
              onClick={openTensorBoard}
            >
              Open Full TensorBoard
            </Button>
          </Fragment>
        )}
      </AnalyticsRoot>

      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <StatCards />
            <TopSellingTable />
            {/* <StatCards2 /> */}
            <H4>Datasets Upoloaded</H4>
            <RowCards />
          </Grid>

          <Grid item md={4} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Tokens Available </Title>
              <SubTitle>For Running Experiment</SubTitle>
              <DoughnutChart
                height="300px"
                color={[palette.primary.dark, palette.primary.light]}
              /> 
            </Card>

            <UpgradeCard />
            {/* <RecentUpdates/> */}
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
