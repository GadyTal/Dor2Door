import React, { FC, useState } from "react";
import { ElderInfo, VolunteerInfo } from "../subComponents";
import { PrimaryBtn } from "../../../core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/";
import { MenuItem, FormControl, Select } from "@material-ui/core/";
import {
  MissionState,
  HebrewDictionary,
  dayTimes,
  DeclineReason,
} from "../../../../shared/Contracts";
import {
  ChangeMissionState,
  scheduleMission,
  UpdateMission,
} from "../../../../services/Mission.service";
import { scheduleMissionData } from "../../../../shared/Responses.Contracts";
import { Stack, Section, Description } from "../../new-submission/Style";
import formatDate from "date-fns/format";
import addDays from "date-fns/addDays";
import { DropdownContainer, Option } from "../../new-submission/SimpleDropdown";
import { RadioButton, RadioButtons } from "../../new-submission/RadioButtons";
import { useAdminState, usePageNavigation } from "../../../hooks/";
import { AdminBackArrow } from "../../../core/";
import { useSessionState } from "../../new-submission/useStringInput";
import { FirstPartResult } from "../../new-submission/FirstPart";
import { useHistory } from "react-router-dom";
import { Config } from "../../../../shared/Config";
import { useCoordinators } from "./useCoordinators";
import { useTranslation } from "react-i18next";

const ModifyMission: FC = () => {
  const history = useHistory();
  const [[currentMission, , lastPage], [setCurrentMission]] = useAdminState();
  const [missionState, setMissionState] = useState<MissionState>(
    currentMission!.state
  );
  const pageNavigator = usePageNavigation();
  const coordinators = useCoordinators();
  const [refreshed, setRefreshed] = useState<boolean>(false);
  const { t } = useTranslation();
  const [selectedCoordinator, setSelectedCoordinator] = useState<any>(0);

  const classes = makeStyles(() =>
    createStyles({
      formControl: {
        width: "90%",
      },
      formControlShorter: {
        width: "60%",
      },
      selectEmpty: {
        padding: 0,
        marginBottom: "2vh",
        marginRight: "2vh",
        borderRadius: "10px",
        textAlign: "right",
      },
    })
  )();
  type menuItemType = {
    title?: string;
  };

  const MissionStateDic: { [key in MissionState]: menuItemType } = {
    [MissionState.pending]: { title: "בקשה ממתינה לאישור אדמין" },
    [MissionState.canceled]: { title: "בקשה בוטלה" },
    [MissionState.completed]: { title: "בקשה הושלמה" },
    [MissionState.acquired]: { title: "תזמון בקשה מחדש" },
    [MissionState.started]: { title: "בקשה התחילה" },
    [MissionState.approved]: { title: "בקשה פעילה" },
    [MissionState.error]: { title: "שגיאה טכנית" },
  };

  const handleChange = (event: any) => setMissionState(event.target.value);

  const stateExecutionHandler = async () => {
    currentMission!.prefered_hours = wantedTime;
    currentMission!.state = missionState || currentMission!.state;
    currentMission!.error_state = missionState === MissionState.error ? DeclineReason.error_by_admin : undefined;
    if (selectedCoordinator !== 0) currentMission!.owner_id = parseInt(selectedCoordinator);

    try {
      await UpdateMission(currentMission!)
      setRefreshed(true);
      // TODO - fix route with react history
      window.location.href = "#" + Config.AppRoutes.Coordinator;
      // BAA - patch - remove this shit
      window.location.reload();
    } catch (e) {
      console.error("Failed to update mission", e);
    }
  };

  const backBtnHandler = () => {
    setCurrentMission(null);
    pageNavigator(lastPage);
  };

  type DateDef = {
    dateString: string;
    title: string;
    times: FirstPartResult["prefered_hours"][];
  };

  function getOptionalToday(): DateDef | null {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour > 18) return null;

    const times: FirstPartResult["prefered_hours"][] = ["evening"];

    if (currentHour < 15) {
      times.unshift("afternoon");
    }

    if (currentHour < 12) {
      times.unshift("morning");
    }

    return {
      dateString: formatDateToServer(now),
      title: "היום",
      times,
    };
  }

  function formatDateToServer(date: Date): string {
    return formatDate(date, "yyyy-MM-dd");
  }

  const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const [wantedTime, setWantedTime] = useSessionState<dayTimes>({
    initialValue: currentMission!.prefered_hours,
    key: "prefered_hours",
  });

  function getAllDates(): DateDef[] {
    const today = getOptionalToday();
    const nextDays = today ? 6 : 7;
    const days: DateDef[] = [];

    if (today) {
      days.push(today);
    }

    for (let i = 0; i < nextDays; i++) {
      const date = addDays(new Date(), i + 1);
      const dayName = dayNames[date.getDay()];
      days.push({
        dateString: formatDateToServer(date),
        times: ["morning", "afternoon", "evening"],
        title: `${date.toLocaleDateString()} (${dayName})`,
      });
    }

    return days;
  }
  const wantedTimeTranslations: Record<
    FirstPartResult["prefered_hours"],
    string
  > = {
    morning: "בוקר",
    afternoon: "צהריים",
    evening: "ערב",
  };

  const relevantDays = getAllDates();
  const [date, setDate] = useSessionState<DateDef>({
    initialValue: relevantDays[0],
    key: "date",
  });
  const wantedTimeForThisDate = date.times.includes(wantedTime as any)
    ? wantedTime
    : date.times[0];
  const StickyLabelMsg = currentMission
    ? currentMission.state === "error"
      ? HebrewDictionary[currentMission.error_state!]
      : HebrewDictionary[currentMission.state]
    : "שגיאה טכנית";

  const StickyLabel = () => (
    <div className="sticky-label"> {StickyLabelMsg}</div>
  );

  // true here is condential for shoing this timing picker
  const ApprovedMissionActions = () =>
    true ? (
      <>
        <div className="sub-title">תזמון מחדש של בקשת ההתנדבות</div>
        <Section>
          <Stack>
            <Description>תאריך</Description>
            <DropdownContainer value={date} onChange={setDate}>
              {relevantDays.map((day) => {
                return (
                  <Option key={day.dateString} value={day}>
                    {day.title}
                  </Option>
                );
              })}
            </DropdownContainer>
            <Description>זמן מועדף</Description>
            <RadioButtons
              value={wantedTimeForThisDate}
              onSelect={setWantedTime}
            >
              <Stack>
                {date.times.map((time) => {
                  return (
                    <RadioButton key={time} value={time}>
                      {wantedTimeTranslations[time]}
                    </RadioButton>
                  );
                })}
              </Stack>
            </RadioButtons>
          </Stack>
        </Section>
        {/* <div className="action-container self">
      <ActionBtn handleClick={scheduleMissionHandler}>תזמן</ActionBtn>
    </div> */}
        {/* ------------------------------------------------------ */}
        {/* REMOVED FOR NOW UNTIL SERVER SUPPOT 
    <div className="sub-title">רענון בקשת התנדבות</div>
    <div className="action-container">
      <span className="text">הבקשה תשלח שוב למתנדבים</span>
      COMMENT: state argument should be changed whenever the server's endpoint is ready
      <ActionBtn
        handleClick={() => {
          stateExecutionHandler();
        }}
        disabled={refreshed}>רענן</ActionBtn>
    </div>
    */}
      </>
    ) : null;

  return (
    <>
      <StickyLabel />
      <div className="modify-mission-container">
        <AdminBackArrow color="white" handleClick={backBtnHandler} />
        <ElderInfo mission={currentMission!} />
        <VolunteerInfo volunteer={currentMission?.volunteer} />
        <Stack>
          <ApprovedMissionActions />
          <Section>
            <div className="sub-title">{t("עדכון אחראי משימה")}</div>
            <DropdownContainer
              onChange={setSelectedCoordinator}
              value={selectedCoordinator || currentMission?.owner_id}
              disabled={!coordinators.data}
            >
              {coordinators.error ? (
                <Option value={0}>{t("שגיאה בטעינת הנתונים")}</Option>
              ) : !coordinators.data ? (
                <Option value={0}>{t("טוען...")}</Option>
              ) : (
                    <>
                      <Option value={0}>ללא שינוי</Option>
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
          </Section>
          <div className="sub-title">עדכון סטטוס בקשה</div>
          <FormControl className={classes.formControl}>
            <Select
              value={missionState ? missionState : currentMission!.state}
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
              variant="outlined"
            >
              <MenuItem value={MissionState.started}>
                {" "}
                {MissionStateDic[MissionState.started].title}{" "}
              </MenuItem>
              <MenuItem value={MissionState.approved}>
                {" "}
                {MissionStateDic[MissionState.approved].title}{" "}
              </MenuItem>
              <MenuItem value={MissionState.pending}>
                {" "}
                {MissionStateDic[MissionState.pending].title}{" "}
              </MenuItem>
              <MenuItem value={MissionState.canceled}>
                {" "}
                {MissionStateDic[MissionState.canceled].title}{" "}
              </MenuItem>
              <MenuItem value={MissionState.completed}>
                {" "}
                {MissionStateDic[MissionState.completed].title}{" "}
              </MenuItem>
              <MenuItem value={MissionState.error}>
                {" "}
                {MissionStateDic[MissionState.error].title}{" "}
              </MenuItem>
            </Select>
          </FormControl>
          <div className="buttons-container">
            <PrimaryBtn handleClick={stateExecutionHandler}>
              עדכן משימה
            </PrimaryBtn>
          </div>
        </Stack>
      </div>
    </>
  );
};

export default ModifyMission;
