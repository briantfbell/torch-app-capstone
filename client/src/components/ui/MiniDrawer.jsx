import * as React from "react";
import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  BarChart,
  Dashboard,
  Logout,
  RunningWithErrors,
  Settings,
  DriveFileMove,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { FormControlLabel, FormGroup, Stack, Switch } from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1), // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff",
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff",
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#003892",
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}));

export default function MiniDrawer({ children, mode, onToggleTheme }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { logoutFunc } = useAuth();
  const handleLogout = async () => {
    if (!window.confirm("You sure?")) return;
    await logoutFunc();
    logout();

    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="img"
        src="/artwork/ctrl_alpha_del_dev_logo.png"
        alt="Our Team's Logo"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: 220,
          height: 100,
          objectFit: "contain",
          //   zIndex is like layers in photoshop; MUST be at +1 to work here
          zIndex: theme.zIndex.drawer + 1,
          opacity: open ? 1 : 0,
          pb: 1.5,
          display: "block",
          mx: "auto",
          //   opacity [transition duration] ease [delay before transition starts]
          transition: open ? "opacity 0.5s ease 0.04s" : "opacity 0.2s ease",
        }}
      />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ position: "relative" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ marginRight: 5 }, open && { display: "none" }]}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component="img"
            src={
              mode === "dark"
                ? "/artwork/Header_Dark_Mode.png"
                : "/artwork/Header_Light_Mode.png"
            }
            alt="TORCH"
            sx={{
              height: 105,
              objectFit: "contain",
              py: 2,
              position: "absolute",
              left: "17%",
              transform: "translateX(-50%)",
            }}
          />

          <Stack sx={{ flexGrow: 1 }} alignItems="end">
            <FormGroup>
              <FormControlLabel
                control={
                  <MaterialUISwitch
                    sx={{ m: 1 }}
                    checked={mode === "dark"}
                    onChange={onToggleTheme}
                  />
                }
              />
            </FormGroup>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            disablePadding
            sx={{ display: "block", mb: 1 }}
            onClick={() => navigate("/dashboard")}
          >
            <ListItemButton>
              <ListItemIcon>
                <BarChart />
              </ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{ display: "block", mb: 1 }}
            onClick={() => navigate("/equipment")}
          >
            <ListItemButton>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText>Equipment</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{ display: "block", mb: 1 }}
            onClick={() => navigate("/shortages")}
          >
            <ListItemButton>
              <ListItemIcon>
                <RunningWithErrors />
              </ListItemIcon>
              <ListItemText>Shortages</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{ display: "block", mb: 1 }}
            onClick={() => navigate("/ingest")}
          >
            <ListItemButton>
              <ListItemIcon>
                <DriveFileMove />
              </ListItemIcon>
              <ListItemText>Upload Documents</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{ display: "block", mb: 1 }}
            onClick={() => navigate("/user-settings")}
          >
            <ListItemButton>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText>User Settings</ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleLogout}
          >
            <ListItemButton>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
