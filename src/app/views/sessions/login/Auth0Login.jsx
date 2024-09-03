import { Box, Button, Card, Grid, styled } from "@mui/material";
import { Paragraph } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const Auth0Root = styled(JustifyBox)(() => ({ minHeight: "100vh !important" }));

const StyledCard = styled(Card)(() => ({
  maxWidth: 800,
  margin: "1rem",
  borderRadius: 12,
  "& .cardHolder": { background: "#1A2038" },
}));

const Auth0Login = () => {
  const [message, setMessage] = useState("");
  const { loginWithPopup } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithPopup();
      navigate("/");
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <Auth0Root>
      <StyledCard>
        <Grid container>
          <Grid item sm={12} xs={12}>
            <JustifyBox p={4} bgcolor="background.default">
              <img src="/assets/images/illustrations/dreamer.svg" width="400" alt="Login" />
            </JustifyBox>

            <JustifyBox p={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                className="socialButton"
                endIcon={<img src="/assets/images/logos/auth0.svg" alt="AuthO" />}
              >
                Sign In With
              </Button>
            </JustifyBox>
            {message && <Paragraph sx={{ color: "error.main" }}>{message}</Paragraph>}
          </Grid>
        </Grid>
      </StyledCard>
    </Auth0Root>
  );
};

export default Auth0Login;
