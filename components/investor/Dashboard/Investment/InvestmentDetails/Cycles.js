import { formatDate } from "@/utils/formatDate";
import {
  Autorenew,
  CheckCircle,
  Error,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StatusChip = ({ status }) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return (
        <Chip
          icon={<CheckCircle />}
          label="Completed"
          color="success"
          size="small"
        />
      );
    case "failed":
      return (
        <Chip icon={<Error />} label="Failed" color="error" size="small" />
      );
    case "in progress":
      return (
        <Chip
          icon={<Autorenew />}
          label="In Progress"
          color="info"
          size="small"
        />
      );
    default:
      return <Chip label={status} size="small" />;
  }
};

const CyclesTable = ({ cycles }) => {
  const [expandedRows, setExpandedRows] = React.useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 4 }}>
      <Table aria-label="Investment cycles table">
        <TableHead sx={{ backgroundColor: "#1b5e20" }}>
          <TableRow >
            <TableCell sx={{ color: "common.white", width: 50 }}></TableCell>
            <TableCell sx={{ color: "common.white" }}>Cycle </TableCell>
            <TableCell sx={{ color: "common.white", py: 4}}>
              Expected ROI
            </TableCell>
            <TableCell sx={{ color: "common.white", py: 4}}>
              Avg. Actual ROI
            </TableCell>
            <TableCell sx={{ color: "common.white", py: 4}}>
              Returns
            </TableCell>
            <TableCell sx={{ color: "common.white", py: 4}}>
              Maturity
            </TableCell>
            <TableCell sx={{ color: "common.white", py: 4}}>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cycles?.map((cycle, index) => {
            const totalRoi = cycle?.returns?.reduce(
              (sum, ret) => sum + ret?.actualRoiPercent,
              0
            );
            const avgRoi = Number(totalRoi / cycle?.returns?.length) || 0;
            const latestReturn = cycle?.returns[cycle?.returns?.length - 1];

            return (
              <React.Fragment key={index}>
                <StyledTableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => toggleRow(cycle._id)}
                    >
                      {expandedRows[cycle._id] ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {cycle.cycleNumber}
                  </TableCell>
                  <TableCell align="right">{cycle.cycleRoiPercent}%</TableCell>
                  <TableCell align="right">
                    <Typography
                      color={
                        avgRoi > cycle.cycleRoiPercent
                          ? "success.main"
                          : "inherit"
                      }
                      fontWeight={
                        avgRoi > cycle.cycleRoiPercent ? 500 : "normal"
                      }
                    >
                      {avgRoi?.toFixed(2)}%
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{cycle?.returns?.length}</TableCell>
                  <TableCell align="right">
                    {cycle.maturityInMonths} months
                  </TableCell>
                  <TableCell align="right">
                    <StatusChip status={latestReturn?.returnStatus} />
                  </TableCell>
                </StyledTableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                  >
                    <Collapse
                      in={expandedRows[cycle._id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Return Details
                        </Typography>
                        <Table size="small" aria-label="returns">
                          <TableHead>
                            <TableRow>
                              <TableCell>Return</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell align="right">ROI</TableCell>
                              <TableCell align="right">Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cycle?.returns?.map((ret, index) => {
                              const returnDate = formatDate(ret.returnDate);

                              return (
                                <TableRow key={index}>
                                  <TableCell component="th" scope="row">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {returnDate}
                                  </TableCell>
                                  <TableCell align="right">
                                    {ret.actualRoiPercent}%
                                  </TableCell>
                                  <TableCell align="right">
                                    <StatusChip status={ret.returnStatus} />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Cycles = ({ cyclesData }) => {
  return (
    <Container maxWidth="lg" disableGutters>
      {/* <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Investment Cycles
        </Typography>
      </Box> */}

      <CyclesTable cycles={cyclesData} />
    </Container>
  );
};

export default Cycles;
