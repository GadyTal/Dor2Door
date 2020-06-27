import React, { FC, createContext, useEffect, useState } from "react";
import { StageRenderer } from "../../core";
import { Dashboard } from "./pages/Dashboard";
import { LastMission } from "./pages/LastMission";
import { Volunteer, Homepage } from "../../../shared/Contracts";
import { getVolunteer } from "../../../services/Volunteer.service";
import { DemoVolunteer } from "../../../shared/DemoData";
import { getAuthToken } from "../../../App";
import { useHistory } from "react-router-dom";
import { Config } from "../../../shared/Config";

export const PAGES = {
  DASHBOARD: 1,
  LAST_MISSION: 2,
};

const pagesDictionary: { [key: number]: FC } = {
  [PAGES.DASHBOARD]: Dashboard,
  [PAGES.LAST_MISSION]: LastMission,
};

const initVolunterrData = async () => {
  try {
  } catch (e) {
    console.error(e);
  }
};
initVolunterrData();

export const HomepageContext = createContext<Homepage | undefined>(undefined);
const HomepageComponent: FC = () => {
  const history = useHistory();
  const [homepageState, setHomepageState] = useState<Homepage | undefined>(
    undefined
  );
  useEffect(() => {
    (async function () {
      // TODO - fix route with react history
      if (!getAuthToken()) return window.location.href = "#" + Config.AppRoutes.Login;
      const response = await getVolunteer();
      // Fix no-op bug when routing to another route
      if (history.location.pathname.indexOf(Config.AppRoutes.Homepage) !== -1) setHomepageState(response);
    })();
  }, []);

  return (
    <HomepageContext.Provider value={homepageState}>
      <StageRenderer
        pages={pagesDictionary}
        startingPage={PAGES.DASHBOARD}
        wrapperClass='homepage-component-container page-padding'
      />
    </HomepageContext.Provider>
  );
};

export default HomepageComponent;
