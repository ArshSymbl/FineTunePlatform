import { AppBar, Button, styled, ThemeProvider, Toolbar, useTheme } from "@mui/material";
import useSettings from "app/hooks/useSettings";
import { topBarHeight } from "app/utils/constant";
import { Paragraph, Span } from "./Typography";

// styled components
const AppFooter = styled(Toolbar)({
  display: "flex",
  alignItems: "center",
  minHeight: topBarHeight,
  "@media (max-width: 499px)": {
    width: "100%",
    display: "table",
    minHeight: "auto",
    padding: "1rem 0",
    "& .container": {
      flexDirection: "column !important",
      "& a": { margin: "0 0 16px !important" },
    },
  },
});

const FooterContent = styled("div")({
  width: "100%",
  display: "flex",
  margin: "0 auto",
  maxWidth: "1170px",
  padding: "0px 1rem",
  alignItems: "center",
});

const Footer = () => {
  const theme = useTheme();
  const { settings } = useSettings();

  const footerTheme = settings.themes[settings.footer.theme] || theme;

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar color="primary" position="static" sx={{ zIndex: 96 }}>
        <AppFooter>
          <FooterContent>
            <a href="https://symbl.ai/">
              <Button variant="contained" color="secondary">
                Symbl.ai
              </Button>
            </a>

            <Span sx={{ m: "auto" }} />

            
          </FooterContent>
        </AppFooter>
      </AppBar>
    </ThemeProvider>
  );
};

export default Footer;
