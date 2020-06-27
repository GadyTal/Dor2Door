import React, { FC, useState, useEffect } from 'react';
import { MissionPreview } from '../subComponents';
import { DemoMissionsArray } from '../../../../shared/DemoData';
import { usePageNavigation, useAdminState } from '../../../hooks';
import { PAGES } from '..';
import { Mission } from '../../../../shared/Contracts';
import { getMissionsSearch } from '../../../../services/Mission.service';
import { AdminBackArrow } from '../../../core';

const SearchResults: FC = () => {

  const [[currentMission, searchQuery, lastPage], [setCurrentMission, setSearchQuery, setLastPage]] = useAdminState();
  const pageNavigator = usePageNavigation();

  const [missionsArray, setmissionsArray] = useState(DemoMissionsArray);

  useEffect(() => {
    (async function () {
      const response = await getMissionsSearch(searchQuery);
      setmissionsArray(response.missions);
    })()
  }, [getMissionsSearch, searchQuery])

  const filteredMissions: Mission[] = missionsArray.filter((m) =>
    ((`${m.elder_first_name} ${m.elder_last_name}`).includes(searchQuery))
  )

  const previewClickHandler = (mission: Mission) => {
    setCurrentMission(mission);
    pageNavigator(PAGES.MODIFY_MISSION);
    setLastPage(PAGES.SEARCH_RESULTS)
  }

  const MissionsList = () => <>
    {filteredMissions.map((mission: Mission, index) => (
      <MissionPreview
        date={mission.scheduled_to_date}
        time={mission.prefered_hours}
        name={`${mission.elder_first_name}  ${mission.elder_last_name}`}
        missionState={mission.state}
        handleClick={() => previewClickHandler(mission)}
        key={index}
      />))}</>

  const handleBackButton = () => {
    setSearchQuery('')
    pageNavigator(PAGES.CALL_CENTER)
  }

  return (
    <>
      <div className="pending-title">תוצאות חיפוש</div>
      <AdminBackArrow color="white" handleClick={handleBackButton} />
      <div className="pending-container">
        <MissionsList />
      </div>
    </>
  );
};

export default SearchResults;
