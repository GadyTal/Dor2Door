import React, { FC, useState } from "react";
import { usePageNavigation, useHomepageState } from "../../../hooks";
import { MainImage, NoBorderBtn } from "../../../core/";
import {
  DashboardTitles,
  LastMissionPreview,
  WaitForACallMsg,
  // WhatsappSignupMsg,
} from "./subComponents/";

import { SecondaryBtn, GeneralStatistics } from "../../../core/";
import { SettingsModal } from "../../../modals/";
import { CircularProgress } from "@material-ui/core";
import settingsIcon from "../../../../assets/icons/settings.png";
import { useTranslation } from "react-i18next";

export const HOMEPAGE_MSGS = {
  WHATSAPP_SIGNUP: 1,
  WAIT_FOR_A_CALL: 2,
  LAST_MISSION_MSG: 3,
};

export const Dashboard: FC = () => {
  const { t } = useTranslation();
  const homepageState = useHomepageState();
  const pageNavigation = usePageNavigation();
  const [signedForWhatsapp, setSignedForWhatsapp] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const handleModalClickOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
  };

  if (homepageState === undefined) {
    return <CircularProgress />;
  }

  const { first_name } = homepageState.volunteer;
  return (
    <>
      <DashboardTitles
        firstName={first_name!}
        missionsAmount={homepageState.missions_amount}
      />
      <MainImage componentName='Dashboard' />
      <GeneralStatistics
        volunteers_count={homepageState.volunteers_count}
        elders_count={homepageState.elders_count}
      />
      {homepageState.missions_amount > 0 ? (
        // <LastMissionPreview />
        <WaitForACallMsg />
      ) : (
        <WaitForACallMsg />
      )}
      <div className='homepage-buttons-container'>
        {/* <SecondaryBtn handleClick={() => alert("Instructions Component")}>
          הוראות התנדבות
        </SecondaryBtn> */}

        <NoBorderBtn handleClick={() => handleModalClickOpen()}>
          <img width='24px' src={settingsIcon} alt='settings' />
          &nbsp; {t("הגדרות")}
        </NoBorderBtn>

        <SettingsModal open={openModal} handleClose={handleModalClose} />
      </div>
    </>
  );
};
