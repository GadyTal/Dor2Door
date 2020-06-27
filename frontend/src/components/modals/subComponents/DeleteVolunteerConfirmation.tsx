import React, { FC } from "react";
import { SecondaryBtn, PrimaryBtn } from "../../core";
import { useModalNavigation } from "../../hooks";
import { SETTINGS_PAGES } from "../SettingsModal";
import { deleteVolunteer } from "../../../services/Volunteer.service";
import { useHistory } from "react-router-dom";
import { Config } from "../../../shared/Config";

export const DeleteVolunteerConfirmation: FC = () => {
  const modalNavigator = useModalNavigation();
  const history = useHistory();

  const handleClick = async () => {
    const reponse = await deleteVolunteer();
    history.push(Config.AppRoutes.Login);
  };
  return (
    <>
      <p className=''>האם את/ה בטוח רוצה למחוק את המשתמש?</p>
      <SecondaryBtn handleClick={handleClick}>כן, מחק משתמש</SecondaryBtn>
      <PrimaryBtn
        handleClick={() => modalNavigator(SETTINGS_PAGES.DETAILS_EDIT)}
      >
        לא, חזור להגדרות
      </PrimaryBtn>
    </>
  );
};
