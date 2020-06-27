import React, {createContext, FC, useState} from 'react';
import {StageRenderer} from '../../core';
import {Mission} from '../../../shared/Contracts';

import ModifyMission from './pages/ModifyMission';
import PendingMissions from './pages/PendingMissions';
import CallCenter from './pages/CallCenter';
import SearchResults from './pages/SearchResults';
import NewSubmission from '../new-submission';
import {getRole} from '../../../services/webApi.service';
import {UserRoles} from '../../../shared/Responses.Contracts';
import {useHistory} from 'react-router-dom';
import {Config} from '../../../shared/Config';

export const PAGES = {
  MODIFY_MISSION: 1,
  PENDING_MISSIONS: 2,
  CALL_CENTER: 3,
  SEARCH_RESULTS: 4,
  NEW_SUBMISSION: 5,
};

const pagesDictionary: { [key: number]: FC } = {
  [PAGES.MODIFY_MISSION]: ModifyMission,
  [PAGES.PENDING_MISSIONS]: PendingMissions,
  [PAGES.CALL_CENTER]: CallCenter,
  [PAGES.SEARCH_RESULTS]: SearchResults,
  [PAGES.NEW_SUBMISSION]: NewSubmission,
};

type AdminContextType = [
  [Mission | null, string, number],
  [React.Dispatch<React.SetStateAction<any>>, React.Dispatch<React.SetStateAction<string>>
    , React.Dispatch<React.SetStateAction<number>>,] //should be mission | null
];

export const AdminContext = createContext<AdminContextType>([[null, '', 0], [() => { }, () => { }, () => { }]]);

const AdminComponent: FC = () => {
  const history: any = useHistory();
  const [currentMission, setcurrentMission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastPage, setLastPage] = useState(0);

  const getStartingPage = () => {
    let role: any = getRole();
    switch (role) {
      case UserRoles.CALL_CENTER:
        return PAGES.CALL_CENTER;
      case UserRoles.COORDINATOR_MANAGER:
      case UserRoles.COORDINATOR:
        return PAGES.PENDING_MISSIONS;
      case UserRoles.ADMIN:
        // admin can be anywhere - check routes
        if (history.location.pathname.indexOf(Config.AppRoutes.CallCenter) !== -1) return PAGES.CALL_CENTER;
        return PAGES.PENDING_MISSIONS;
      default:
        history.push(Config.AppRoutes.Homepage);
        return PAGES.PENDING_MISSIONS;
    }
  }

  return (
    <AdminContext.Provider value={[[currentMission, searchQuery, lastPage], [setcurrentMission, setSearchQuery, setLastPage]]}>
      <StageRenderer
        pages={pagesDictionary}
        startingPage={getStartingPage()}
        wrapperClass="admin-component-container"
      />
    </AdminContext.Provider>
  );
};

export default AdminComponent;
