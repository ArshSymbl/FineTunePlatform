import {
  Avatar,
  Box,
  Card,
  Icon,
  IconButton,
  MenuItem,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
  Button,
} from "@mui/material";
import { FlexBetween } from "app/components/FlexBox";
import { Paragraph } from "app/components/Typography";
import React from "react";

const CardHeader = styled(FlexBetween)(() => ({
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize",
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    height: 15,
    width: 50,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" },
}));

const Small = styled("small")(({ bgcolor }) => ({
  height: 15,
  width: 50,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
}));

const TopSellingTable = () => {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;

  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <Title>Fine-tune Requests</Title>
        <Button variant="contained" color="primary" href="/pages/new-jobRequest">
          Create New Experiment
        </Button>
      </CardHeader>

      <Box overflow="auto">
        <ProductTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ px: 3 }} colSpan={4}>
                Name
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                Loss
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                Status
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={1}>
                Details
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index} hover>
                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: "capitalize" }}>
                  <Box display="flex" alignItems="center">
                    <Avatar src={product.imgUrl} />
                    <Paragraph sx={{ m: 0, ml: 4 }}>{product.name}</Paragraph>
                  </Box>
                </TableCell>

                <TableCell align="left" colSpan={2} sx={{ px: 0, textTransform: "capitalize" }}>
                  {product.price}
                </TableCell>

                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                  {product.available === 'completed' ? (
                      <Small bgcolor={bgPrimary}>Completed</Small>
                    ) : product.available === 'deleted' ? (
                      <Small bgcolor={bgError}>Deleted</Small>
                    ) : product.available === 'in progress' ? (
                      <Small bgcolor={bgSecondary}>In Progress</Small>
                    ) : (
                      null
                    )}
                </TableCell>

                <TableCell sx={{ px: 0 }} colSpan={1}>
                  <IconButton>
                    <Icon color="primary">description</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
};

const productList = [
  {
    imgUrl: "/assets/images/products/call-score.png",
    name: "Fine-Tune Call Score 02",
    price: 0.01,
    available: 'completed',
  },
  {
    imgUrl: "/assets/images/products/Meeting-Notes.webp",
    name: "Fine-Tune Meeting Notes",
    price: 0.003,
    available: 'completed',
  },
  {
    imgUrl: "/assets/images/products/Realtime-Support.webp",
    name: "Fine-Tune Realtime Assist",
    price: 0.02,
    available: 'deleted',
  },
  {
    imgUrl: "/assets/images/products/Search.jpeg",
    name: "Fine-Tune Search",
    price: 1.67,
    available: 'in progress',
  },
  {
    imgUrl: "/assets/images/products/call-score.png",
    name: "Fine-Tune Call Score 01",
    price: 0.9,
    available: 'deleted',
  },
];

export default TopSellingTable;
