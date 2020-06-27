import React, { FC } from "react";
import { Dialog, makeStyles } from "@material-ui/core/";
import { ModalRenderer } from "../core";
import { ModalPage, ModalTitleButtonType } from "../core/ModalRenderer";

import {
  ContactUs,
  Notifications,
  PersonalDetailsEdit,
  MainMenu,
} from "./subComponents/";
import { DeleteVolunteerConfirmation } from "./subComponents/DeleteVolunteerConfirmation";
import { useTranslation } from "react-i18next";

export const SETTINGS_PAGES = {
  MENU: 1,
  DETAILS_EDIT: 2,
  NOTIFICATIONS: 3,
  CONTACT_US: 4,
  DELETE_VOLUNTEER_CONFIRMATION: 5,
};

type SettingsModalProps = {
  open: boolean;
  handleClose: any;
};

export const SettingsModal: FC<SettingsModalProps> = ({
  open,
  handleClose,
}) => {
  const { t } = useTranslation();
  const classes = makeStyles({
    root: {
      borderRadius: "20px",
      minHeight: '40vh'
    },
  })();

  const SettingsPagesDictionary: {
    [key: number]: ModalPage;
  } = {
    [SETTINGS_PAGES.MENU]: {
      title: t("הגדרות"),
      page: MainMenu,
      titleButtonType: ModalTitleButtonType.CLOSE,
      handleClose: handleClose,
    },
    [SETTINGS_PAGES.DETAILS_EDIT]: {
      title: t("עריכת פרטים"),
      page: PersonalDetailsEdit,
      titleButtonType: ModalTitleButtonType.BACK,
      pageToContinue: SETTINGS_PAGES.MENU,
    },
    [SETTINGS_PAGES.DELETE_VOLUNTEER_CONFIRMATION]: {
      title: t("מחיקת משתמש"),
      page: DeleteVolunteerConfirmation,
      titleButtonType: ModalTitleButtonType.CLOSE,
      pageToContinue: SETTINGS_PAGES.DETAILS_EDIT,
    },
    [SETTINGS_PAGES.NOTIFICATIONS]: {
      title: t("התראות"),
      page: Notifications,
      titleButtonType: ModalTitleButtonType.BACK,
      pageToContinue: SETTINGS_PAGES.MENU,
    },
    [SETTINGS_PAGES.CONTACT_US]: {
      title: t("צור קשר"),
      page: ContactUs,
      titleButtonType: ModalTitleButtonType.BACK,
      pageToContinue: SETTINGS_PAGES.MENU,
    },
  };

  return (
    <Dialog
      open={open}
      keepMounted
      fullWidth={true}
      onClose={handleClose}
      PaperProps={{
        classes: {
          root: classes.root,
        },
      }}
    >

      <ModalRenderer
        startingPage={SETTINGS_PAGES.MENU}
        pages={SettingsPagesDictionary}
      />
    </Dialog>
  );
};
