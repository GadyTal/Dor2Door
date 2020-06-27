import React, { FC, createContext, useEffect, useState } from 'react';
import { StageRenderer } from '../../core';
import { MissionRequest } from './pages/MissionRequest';
import { Terms_1 } from './pages/Terms_1';
import { Terms_2 } from './pages/Terms_2';
import { MakeACall } from './pages/MakeACall';
import { MissionInProgress } from './pages/MissionInProgress';

import { Mission, MissionState } from '../../../shared/Contracts';
import { getVolunteer, getVolunteerMission } from '../../../services/Volunteer.service';
import { useRouteMatch } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { MissionCompleted, MissionHasTaken, MissionStopped, MissionError } from './pages/EndOfMission';

export const PAGES = {
  MISSION_REQUEST: 1,
  TERMS_1: 2,
  TERMS_2: 3,
  MAKE_A_CALL: 4,
  MISSION_IN_PROGRESS: 5,
  MISSION_COMPLETED: 6,
  MISSION_STOPPED: 7,
  MISSION_HAS_TAKEN: 8,
  MISSION_ERROR: 9,
};

type MissionContextType = { volunteer: any, mission: any, missionId: any, setMission: any };

const pagesDictionary: { [key: number]: FC } = {
  [PAGES.MISSION_REQUEST]: MissionRequest,
  [PAGES.TERMS_1]: Terms_1,
  [PAGES.TERMS_2]: Terms_2,
  [PAGES.MAKE_A_CALL]: MakeACall,
  [PAGES.MISSION_IN_PROGRESS]: MissionInProgress,
  [PAGES.MISSION_COMPLETED]: MissionCompleted,
  [PAGES.MISSION_STOPPED]: MissionStopped,
};

export const MissionContext = createContext<MissionContextType>({
  mission: undefined,
  volunteer: undefined,
  missionId: undefined,
  setMission: () => { }
});

interface error {
  errorType: number;
  errorMessage: string;
}

const MissionComponent: FC = () => {
  const match: any = useRouteMatch();
  const missionId: string = match.params.missionId;
  const [volunteer, setVolunteer] = useState();
  const [error, setError] = useState<error>({ errorType: 0, errorMessage: '' });
  // const [errorType, setErrorType] = useState<number>(0);
  const [mission, setMission] = useState<Mission>();

  useEffect(() => {
    Promise.all([getVolunteerMission(missionId), getVolunteer()])
      .then((res: any) => { setMission(res[0]); setVolunteer(res[1]) },
        (e: any) => {
          if (!e.response) return setError({ errorMessage: e.message, errorType: 0 });
          switch (e.response.status) {
            case 401: //unauthorized
              return setError({ errorMessage: e.response.message, errorType: 401 });
            case 403:
              return setError({ errorMessage: e.response.data.detail, errorType: 403 });
            case 404:
              return setError({ errorMessage: e.response.data.detail, errorType: 404 });
            case 422:
              return setError({ errorMessage: e.response.data.detail[0].message, errorType: 422 });
            default:
              break;
          }
        });
  }, [missionId])

  const getStartingPage = (mission: Mission) => {
    // TODO - if got no mission - no mission page
    if (!mission) return PAGES.MISSION_REQUEST;
    switch (mission.state) {
      case MissionState.pending:
      case MissionState.approved:
        return PAGES.MISSION_REQUEST;
      case MissionState.acquired:
        return PAGES.MAKE_A_CALL;
      case MissionState.started:
        return PAGES.MISSION_IN_PROGRESS;
      case MissionState.completed:
        return PAGES.MISSION_COMPLETED;
      case MissionState.canceled:
        return PAGES.MISSION_STOPPED;
      default:
        setError({ errorMessage: 'Unknown mission status', errorType: 0 });
        return PAGES.MISSION_REQUEST;
    }
  }

  return (
    <MissionContext.Provider value={{ volunteer, mission, missionId, setMission }}>
      {!error.errorMessage && mission && volunteer ?
        <StageRenderer
          pages={pagesDictionary}
          startingPage={getStartingPage(mission)}
          wrapperClass="mission-component-container page-padding" />
        : error.errorMessage ? <MissionError errorType={error.errorType} /> : <div className="loader-cotnainer"> <CircularProgress /></div>}
    </MissionContext.Provider>
  );

}
export default MissionComponent;
