import React from "react";
import "./App.scss";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import { History } from "history";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import LoginComponent from "./components/stages/login";
import MissionComponent from "./components/stages/mission";
import HomepageComponent from "./components/stages/homepage/";
import AdminComponent from "./components/stages/admin/";
import { UserRoles } from "./shared/Responses.Contracts";
import { getRole, getTokenFromLocalStorage, setRouteBack } from "./services/webApi.service";
import NewSubmission from "./components/stages/new-submission";
import { Config } from "./shared/Config";

const checkUserRoles = (history: History) => {
  if (history.location.pathname !== "/") return;
  // remember user asked route
  if (history.location.pathname.indexOf("mission/") !== -1) return;
  let role = getRole();
  let token = getTokenFromLocalStorage();
  switch (role) {
    case UserRoles.USER:
      if (token && token.length) {
        return history.push(Config.AppRoutes.Homepage);
      }
      break;
    case UserRoles.CALL_CENTER:
      if (token && token.length) {
        return history.push(Config.AppRoutes.CallCenter);
      }
      break;
    case UserRoles.COORDINATOR:
    case UserRoles.COORDINATOR_MANAGER:
      if (token && token.length) {
        return history.push(Config.AppRoutes.Coordinator);
      }
      break;
    case UserRoles.ADMIN: // can be anywhere
      if (history.location.pathname.indexOf(Config.AppRoutes.CallCenter) === -1) return history.push(Config.AppRoutes.Coordinator);
      else return history.push(Config.AppRoutes.CallCenter);
    default:
      break;
  }
};

function App() {
  const history = useHistory();
  checkUserRoles(history);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className='app-container'>
        {/* Whatsapp links! */}
        {/* <a href="https://wa.me/whatsappphonenumber/?text=urlencodedtext+14155238886">Send</a> */}
        {/* <a href="https://wa.me/+14155238886?text=join%20black-hospital">Send2</a> */}

        <Switch>
          <Route exact path='/' component={HomepageComponent} />
          {/* Login */}
          <Route exact path={Config.AppRoutes.Login} component={LoginComponent} />
          {/* New submission - public route */}
          <Route path={Config.AppRoutes.NewSubmission} component={NewSubmission} />
          {/* missins */}
          <PrivateRoute exact path={Config.AppRoutes.Mission + '/:missionId'} component={MissionComponent} />
          {/* admins and call center */}
          <PrivateRoute exact path={Config.AppRoutes.Homepage} component={HomepageComponent} />
          <PrivateRoute exact path={Config.AppRoutes.CallCenter} component={AdminComponent} />
          <PrivateRoute exact path={Config.AppRoutes.Coordinator} component={AdminComponent} />
        </Switch>
      </div>
    </MuiPickersUtilsProvider>
  );
}

const PrivateRoute = ({ component, ...rest }: any) => {
  const routeComponent = (props: any) => {
    if (isAuthenticated()) return React.createElement(component, props);
    else {
      // save current route and then move to login
      setRouteBack(window.location.href.split("#")[1]);
      return <Redirect to={{ pathname: Config.AppRoutes.Login }} />;
    }
  };
  return <Route {...rest} render={routeComponent} />;
};

export const getAuthToken = () => {
  let token = getTokenFromLocalStorage();
  return token && token.length;
};

export const isAuthenticated = () => getAuthToken() !== false;

export default App;
