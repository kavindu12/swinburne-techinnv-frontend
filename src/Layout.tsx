import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import Timer from "@mui/icons-material/MoreTime";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, Outlet, useMatches } from "react-router-dom";
import { useEffect } from "react";

const drawerWidth = 240;

function ListItemWithIcon(props: any) {
  const go = useNavigate();
  const matches = useMatches();

  if (!props.roles.includes(sessionManager.getSession()?.role)) {
    return null;
  }

  const isActive = matches[2].pathname === props.path;

  return (
    <ListItem
      key={props.text}
      disablePadding
      sx={{
        backgroundColor: isActive ? "#DDF" : "#FFF",
      }}
    >
      <ListItemButton
        onClick={() => {
          props?.onClick?.();
          go(props.path);
        }}
      >
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText primary={props.text} />
      </ListItemButton>
    </ListItem>
  );
}

export const sessionManager = {
  logout: () => {
    localStorage.setItem(
      "tip_session",
      JSON.stringify({
        isLoggedIn: false,
      }),
    );
  },
  login: (username: string, password: string) => {
    const current = JSON.parse(localStorage.getItem("tip_session") || "{}");

    if (current?.isLoggedIn) {
      return {
        status: "success",
      };
    }

    if (username === "admin" && password === "admin1234") {
      localStorage.setItem(
        "tip_session",
        JSON.stringify({
          isLoggedIn: true,
          role: "admin",
          username: "admin",
        }),
      );
      return {
        status: "success",
      };
    }

    if (username === "user1" && password === "user1234") {
      localStorage.setItem(
        "tip_session",
        JSON.stringify({
          isLoggedIn: true,
          role: "user",
          username,
        }),
      );
      return {
        status: "success",
      };
    }

    return {
      status: "failed",
      message: "Incorrect username or password",
    };
  },
  getSession: (): { isLoggedIn: boolean; role?: "admin" | "user"; username?: string } => {
    const current = JSON.parse(localStorage.getItem("tip_session") || "{}");

    if (!current?.isLoggedIn) {
      return {
        isLoggedIn: false,
      };
    }

    return current;
  },
};

export default function Layout(props: React.PropsWithChildren) {
  const go = useNavigate();
  const matches = useMatches();

  const isLoginPage = matches[2].pathname.startsWith("/login");

  useEffect(() => {
    if (!sessionManager.getSession()?.isLoggedIn && !isLoginPage) {
      go("/login");
    }
  }, []);

  if (!sessionManager.getSession()?.isLoggedIn && !isLoginPage) {
    return null;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Vulnerability Prediction Tip Project
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItemWithIcon path="/" text="Dashboard" icon={<DashboardIcon />} roles={["admin", "user"]} />
          <ListItemWithIcon path="/alerts" text="Alerts" icon={<NotificationsIcon />} roles={["admin"]} />
          <ListItemWithIcon path="/analysis" text="System Analysis" icon={<GasMeterIcon />} roles={["admin", "user"]} />
          <ListItemWithIcon path="/realtime" text="Realtime Analysis" icon={<Timer />} roles={["admin"]} />
          <ListItemWithIcon
            path="/upload"
            text="Test File Upload"
            icon={<FileUploadIcon />}
            roles={["admin", "user"]}
          />
          <ListItemWithIcon path="/predictions" text="Predictions" icon={<HistoryIcon />} roles={["admin"]} />
        </List>
        <Divider />
        {/* <List>
          <ListItemWithIcon path="/users" text="Users" icon={<PersonIcon />} roles={["admin", "user"]} />
          <ListItemWithIcon path="/settings" text="Settings" icon={<SettingsIcon />} roles={["admin", "user"]} />
        </List> */}
        <Divider />
        <List>
          <ListItemWithIcon
            path="/login"
            text="Logout"
            icon={<LogoutIcon />}
            onClick={() => sessionManager.logout()}
            roles={["admin", "user"]}
          />
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
