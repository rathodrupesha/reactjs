import { Typography } from "@mui/material";
import React from "react";

const WhoWeServeHeader = () => {
  return (
    <Typography
      variant="h5"
      align="center"
      color="text.secondary"
      component=""
      style={{
        position: "relative",
        alignItems: "center",
        height: "80px",
        width: "80px",
        background:
          "linear-gradient(90deg, #C72970 0%, #D0395F 7.08%, #DA4A4E 28.44%, #E55D3E 100%)",
        borderRadius: "50%",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
        component=""
        style={{
          left: "4.17%",
          right: "4.17%",
          top: "4.17%",
          bottom: "70.83%",
          position: "absolute",
          display: "flex",
        }}
      >
        <svg
          width="10"
          height="32"
          viewBox="0 0 10 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ paddingLeft: "25%", paddingTop: "25%" }}
        >
          <path
            d="M0 0H8C8.35362 0 8.69276 0.140475 8.94281 0.390523C9.19286 0.640572 9.33333 0.979711 9.33333 1.33333V30.6667C9.33333 31.0203 9.19286 31.3594 8.94281 31.6095C8.69276 31.8595 8.35362 32 8 32H0V0Z"
            fill="white"
          />
        </svg>
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
        component=""
        style={{
          left: "4.17%",
          right: "4.17%",
          top: "4.17%",
          bottom: "70.83%",
          position: "absolute",
        }}
      >
        <svg
          width="10"
          height="32"
          viewBox="0 0 10 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ paddingTop: "25%", paddingRight: "5%" }}
        >
          <path
            d="M0 0H8C8.35362 0 8.69276 0.140475 8.94281 0.390523C9.19286 0.640572 9.33333 0.979711 9.33333 1.33333V30.6667C9.33333 31.0203 9.19286 31.3594 8.94281 31.6095C8.69276 31.8595 8.35362 32 8 32H0V0Z"
            fill="white"
          />
        </svg>
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
        component=""
        style={{
          left: "4.17%",
          right: "4.17%",
          top: "4.17%",
          bottom: "70.83%",
          position: "absolute",
        }}
      >
        <svg
          width="8"
          height="16"
          viewBox="0 0 8 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ paddingTop: "35%", paddingLeft: "25%" }}
        >
          <path
            d="M0 5.33333H8L4 0L0 5.33333ZM0 10.6667H8L4 16L0 10.6667Z"
            fill="white"
          />
        </svg>
      </Typography>
    </Typography>
  );
};

export default WhoWeServeHeader;
