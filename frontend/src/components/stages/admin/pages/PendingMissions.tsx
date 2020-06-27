import React, { FC, useState, useEffect } from 'react';
import { MissionPreview } from '../subComponents/';
import { DemoMissionsArray } from '../../../../shared/DemoData';
import { usePageNavigation, useAdminState } from '../../../hooks';
import { PAGES } from '../';
import { Mission, MissionState } from '../../../../shared/Contracts';
import { getMissions } from '../../../../services/Mission.service';
import { useCoordinators } from './useCoordinators';
import { DropdownContainer, Option } from '../../new-submission/SimpleDropdown';
import { useTranslation } from 'react-i18next';

const PendingMissions: FC = () => {
  const coordinators = useCoordinators();
  const [selectedCoordinator, setSelectedCoordinator] = useState<any>(0);
  const [[currentMission, , lastPage], [setCurrentMission, , setLastPage]] = useAdminState();
  const [selectedStatus, setSelectedStatus] = useState<any>(0);

  const { t } = useTranslation();

  const pageNavigator = usePageNavigation();
  const [missionsArray, setmissionsArray] = useState([]);
  
  const allMissionsCount = missionsArray.length;
  const selectedStatusObj = selectedStatus.toString().replace(/\"/g,"");

  const isFiltered = selectedStatus != 0 || selectedCoordinator != 0;



  useEffect(() => {
    (async function () {
      const response = await getMissions();
      console.log(response)
      setmissionsArray(response ? response.missions : null);
    })()
  }, [getMissions])

  const previewClickHandler = (mission: Mission) => {
    setCurrentMission(mission);
    pageNavigator(PAGES.MODIFY_MISSION);
    setLastPage(PAGES.PENDING_MISSIONS)
  }

  function getTextByStatus (status: string){
    switch(status){
      case "pending": return "בקשה ממתינה לאישור אדמין";
      case "acquired": return "מתנדב אישר תנאים אך טרם החל";
      case "started": return "בקשה בטיפול מתנדב" ;
      case "approved": return "בקשה פעילה";
      case "completed": return "בקשה הושלמה";
      case "canceled": return "בקשה בוטלה";
      case "error": return "בקשה עם שגיאה ";
    }
  }

  function getCountByStatus (status: string){
    const statusValue = status.toString().replace(/\"/g,"");
    const count = missionsArray.filter((mission: Mission, index) => mission.state == statusValue).length;
    return count;
  }

  const clearFilters = () => {
    setSelectedCoordinator(0);
    setSelectedStatus(0);
  }
 
  const MissionDisplay =
    missionsArray.map((mission: Mission, index) => {
      const allCoordinators = selectedCoordinator == 0;
      const specificCoordinator = mission.owner_id == selectedCoordinator;
      const allStatuses = selectedStatusObj == 0;
      const specificStatus =  mission.state == selectedStatusObj;
      return (
        (specificCoordinator || allCoordinators) && (specificStatus || allStatuses) 
        && <MissionPreview
        date={mission.scheduled_to_date}
        time={mission.prefered_hours}
        name={`${mission.elder_first_name}  ${mission.elder_last_name}`}
        missionState={mission.state}
        errorState={mission.error_state}
        handleClick={() => previewClickHandler(mission)}
        key={index}
      />)});

  return (
    <>
    <div className = "filter-title-section" >
      <div className="pending-title">ניהול בקשות</div>
      <div className="filter-container">
        <DropdownContainer
          onChange={setSelectedCoordinator}
          value={selectedCoordinator}
          disabled={!coordinators.data}
        >
          {coordinators.error ? (
            <Option value={0}>{t("שגיאה בטעינת הנתונים")}</Option>
          ) : !coordinators.data ? (
            <Option value={0}>{t("טוען...")}</Option>
          ) : (
                <>
                  <Option value={0}>כל הרכזים</Option>
                  {coordinators.data.coordinators.map((coord: any) => {
                    return (
                      <Option key={coord.id} value={coord.id}>
                        {coord.name}
                      </Option>
                    );
                  })}
                </>
              )}
        </DropdownContainer>
        <DropdownContainer
          onChange={setSelectedStatus}
          value={selectedStatus}
        >
        <Option value={0}>כל הבקשות ({allMissionsCount})</Option>
        {Object.keys(MissionState).map((status: any) => {
                    return (
                      <Option key={status} value={status}>
                        {getTextByStatus(status)} ({getCountByStatus(status)})
                      </Option>
                    );
                  })}      
        </DropdownContainer>
        {isFiltered && <button className="clear-filters" onClick={clearFilters}>ניקוי פילטרים</button>}
      </div>
      </div>
      <div className="pending-container">
        {MissionDisplay}
      </div>
    </>
  );
};

export default PendingMissions;
