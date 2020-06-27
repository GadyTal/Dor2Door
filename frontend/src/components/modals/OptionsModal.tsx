import React, { useState, Ref, ReactElement, FC } from 'react';
import {
  DialogContentText,
  makeStyles,
  DialogContent,
  DialogTitle,
  Dialog,
  Slide,
} from '@material-ui/core/';
import { TransitionProps } from '@material-ui/core/transitions';

import { PrimaryBtn, SecondaryBtn, NoBorderBtn, XCloseBtn } from '../core';

import { usePageNavigation } from '../hooks';
import { PAGES } from '../stages/mission';
import { setVolunteerMissionDecline } from '../../services/Volunteer.service';
import { DeclineReason } from '../../shared/Contracts';
import { Stack } from '../stages/new-submission/Style';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type OptionsModalProps = {
  elementTag: elementTypes;
  cancellationOptions?: { stringValue: string, reason: DeclineReason }[];
  title: string;
  closeBtn: closeBtnType;
  description: string;
  missionId: string;
  handleClick?: any;
};

type closeBtnType = 'X' | 'PrimaryBtn';

// const backPrimaryBtn = <PrimaryBtn>חזרה</PrimaryBtn>

const closeBtnDictionary: { [key in closeBtnType]: any } = {
  PrimaryBtn: PrimaryBtn,
  X: XCloseBtn,
};
type elementTypes = 'Primary' | 'Secondary' | 'NoBorder';

const TagsDictionary: { [key in elementTypes]: any } = {
  Primary: PrimaryBtn,
  Secondary: SecondaryBtn,
  NoBorder: NoBorderBtn,
};
export const OptionsModal: FC<OptionsModalProps> = ({
  elementTag,
  cancellationOptions,
  children,
  title,
  closeBtn,
  description,
  missionId
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const pageNavigator = usePageNavigation();

  const Tag = TagsDictionary[elementTag];

  const CloseBtn = closeBtnDictionary[closeBtn];
  //effect DialogContent radius
  const classes = makeStyles({
    root: {
      borderRadius: '30px',
      textAlign: 'center'
    },
  })();

  function stopMissionHandler(reason: DeclineReason) {
    pageNavigator(PAGES.MISSION_STOPPED)
    setVolunteerMissionDecline(missionId, reason);
  }

  return (
    <>
      <Tag handleClick={handleClickOpen}>{children} </Tag>
      <Dialog
        open={open}
        // TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        onClose={handleClose}
        PaperProps={{ classes: { root: classes.root } }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <div className="options-modal title">{title}</div>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" >
            <span className="options-modal content">{description}</span>
          </DialogContentText>
        </DialogContent>
        <div className="buttons-container">
          <Stack>

            {cancellationOptions?.map((option, index) => (
              <SecondaryBtn
                key={index}
                handleClick={() => { stopMissionHandler(option.reason) }}      >
                {option.stringValue}
              </SecondaryBtn>
            ))}
          </Stack>
          <CloseBtn handleClick={handleClose}>חזרה</CloseBtn>
        </div>
      </Dialog>
    </>
  );
};
