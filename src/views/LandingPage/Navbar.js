import  React , {component} from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from "@material-ui/icons/Close";
import {
  Toolbar,
  AppBar,
  Box,
  Container,
  styled,
  Button,
  Typography,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,Drawer
} from "@mui/material";

import { ReactComponent as Logo } from "../../assets/img/logo.svg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
//import Drawer from "@material-ui/core/Drawer";
import { useHistory } from "react-router-dom";

const pages = [
  "About",
  "How it Works",
  "Features",
  "Pricing",
  "Get in Touch",
  "Login",
];
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 2),
  background :"#ffff",
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }), 
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const Navbar = ({ handleNavbar }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [state, setState] = React.useState({
    left: false,
  });
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const HeaderMain = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.otherColor.blue,
    // padding: "16px 0px",
  }));

  const LoginButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.palette.shape.borderRadius,
    width: "140px",
    height: "40px",
    color: "#fff",
    textTransform: "capitalize",
  }));
  const handleDrawerClose = () => {
    setOpen(false);
  }
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      
      <List>
        {pages.map((text, index) => (
          <ListItem key={text} disablePadding style={{borderBottom :"2px solid rgb(246, 245, 250)"}}>
            <ListItemButton
              onClick={() =>
                text === "Login"
                  ? history.push("/superadmin/login")
                  : handleNavbar(text)
              }
            >
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <>
      <HeaderMain>
        <AppBar
          position="static"
          style={{ backgroundColor: "#333252", boxShadow: "none" }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/landing"
                sx={{
                  mr: 2,
                  paddingLeft: { lg: "10%", md: "2%", sm: "0" },
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  // paddingLeft: "5%",
                }}
              >
                <Logo />
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <Drawer
                  transitionDuration={{ enter: 1600, exit: 1000 }}
                  anchor={"left"}
                  open={state["left"]}
                  onClose={toggleDrawer("left", false)}
                >
                  <DrawerHeader>
          <IconButton onClick={ toggleDrawer("left", false)} >
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
                  {list("left")}
                </Drawer>

                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={toggleDrawer("left", true)}
                  color="inherit"
                  style={{ color: "white" }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() =>
                        page === "Login"
                          ? history.push("/superadmin/login")
                          : handleNavbar(page)
                      }
                    >
                      <Typography
                        // onClick={() => handleNavbar(page)}
                        textAlign="center"
                      >
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <Logo />
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  paddingLeft: "25%",
                  display: { xs: "none", md: "flex" },
                }}
              >
                {pages.map((page) => {
                  if (page !== "Login") {
                    return (
                      <Button
                        key={page}
                        className="menu-btn"
                        onClick={() => handleNavbar(page)}
                        sx={{
                          my: 2,
                          color: "white",
                          display: "block",
                          ":hover": { background: "#FF6C23" },
                        }}
                      >
                        {page}
                      </Button>
                    );
                  }
                })}
              </Box>

              <Box
                sx={{ flexGrow: 0, marginRight: "5%" }}
                display={{
                  xs: "none",
                  md: "block",
                  lg: "block",
                  xl: "block",
                  xxl: "block",
                }}
              >
                <LoginButton
                  variant="contained"
                  color="primary"
                  //sx={{ ":hover": { background: "#FF6C23" } }}
                  onClick={() => history.push("/superadmin/login")}
                >
                  Login
                </LoginButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HeaderMain>
    </>
  );
};

export default Navbar;
