import useSettings from "app/hooks/useSettings";
import React from "react";

const MatxLogo = ({ className }) => {
  const { settings } = useSettings();
  const theme = settings.themes[settings.activeTheme];

};

export default MatxLogo;
