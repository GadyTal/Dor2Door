import React, { FC, useState, useEffect } from "react";
import { MissionPreview } from "../subComponents";
import { DemoMissionsArray } from "../../../../shared/DemoData";
import { usePageNavigation, useAdminState } from "../../../hooks";
import { PAGES } from "..";
import { Mission } from "../../../../shared/Contracts";
import { getMissions } from "../../../../services/Mission.service";
import { MainImage, PrimaryBtn } from "../../../core";
import { useHistory } from "react-router-dom";

const CallCenter: FC = () => {
  const pageNavigator = usePageNavigation();
  const history = useHistory();
  const [
    [currentMission, searchQuery],
    [setCurrentMission, setSearchQuery],
  ] = useAdminState();
  const [missionsArray, setmissionsArray] = useState(DemoMissionsArray);

  const handleSearchQuery = (e: any) => setSearchQuery(e.target.value);

  return (
    <>
      <div className="call-center-container">
        <MainImage componentName="CallCenter" />
        <div className="titles-container">
          <div className="title">חיפוש בקשה</div>
          <div className="sub-title">חיפוש בקשה לפי שם מבקש הסיוע</div>
        </div>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="למשל: לאה אהרוני"
            onChange={handleSearchQuery}
          />
          <PrimaryBtn
            handleClick={() => pageNavigator(PAGES.SEARCH_RESULTS)}
            disabled={!searchQuery?.length || searchQuery.length < 3}
          >
            חיפוש
          </PrimaryBtn>
        </div>
        <PrimaryBtn handleClick={() => history.push("/new-submission")}>
          בקשה חדשה
        </PrimaryBtn>
      </div>
    </>
  );
};

export default CallCenter;
