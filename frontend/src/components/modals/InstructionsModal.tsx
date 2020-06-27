import React, { useRef, useEffect, useState, FC } from 'react';
import {
  makeStyles,
  Dialog,
  DialogProps,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@material-ui/core/';
import { PrimaryBtn, SpecialActionBtn } from '../core';
import purpleCallIcon from '../../assets/icons/purple/purple-call.png';
import purpleVSign from '../../assets/icons/purple/purple-v-sign.png';
import whiteCallIcon from '../../assets/icons/white-call.png';
import { useMissionState } from '../hooks';

type InstructionsModalProps = {
  handleClick: any;
};

export const InstructionsModal: FC<InstructionsModalProps> = ({
  handleClick,
}) => {
  const [open, setOpen] = useState(false);
  // const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    // setScroll(scrollType);
  };

  const state = useMissionState();
  const handleClose = () => setOpen(false);

  const descriptionElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  type content = {
    title: string;
    content: string;
  };

  const elder_name = state.mission.elder_first_name;

  const termsContent: content[] = [
    {
      title: 'זה הזמן להציג את עצמך',
      content: 'בגדול השם שלך ושהגעת דרך Door2Dor, אבל אפשר גם להרחיב',
    },
    {
      title: `להבין מה בדיוק הצורך של ${elder_name}`,
      content: 'מה לקנות? אולי רק להביא משהו? מאיפה?',
    },
    {
      title: 'לתאם את אמצעי התשלום',
      content: `אם יש צורך להוציא כסף מהכיס שלך, לשאול איך ${elder_name} רוצה להחזיר לך`,
    },
    {
      title: 'לתאם את זמן המסירה',
      content: `מהו הזמן האופטימלי היום עבורך ועבור ${elder_name} `,
    },
  ];
  const classes = makeStyles({
    root: {
      borderRadius: '30px',
    },
  })();

  return (
    <>
      {' '}
      <SpecialActionBtn
        handleClick={handleClickOpen('paper')}
        imgSrc={purpleCallIcon}
      >
        חייג עכשיו
      </SpecialActionBtn>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        PaperProps={{ classes: { root: classes.root } }}
      >
        <DialogTitle>
          <h1 className="terms-modal title">במהלך השיחה</h1>
        </DialogTitle>
        <DialogContent dividers={true}>
          {termsContent.map((item, index) => (
            <>
              <div className="grid-container" key={index}>
                <div className="p-v-sign">
                  <img src={purpleVSign} width="24px" alt="todo" />
                </div>
                <div className="p-title">{item.title}</div>
                <div className="p-content">{item.content}</div>
              </div>
            </>
          ))}
        </DialogContent>
        <DialogActions style={{ placeContent: 'center' }}>
          <PrimaryBtn
            handleClick={() => {
              handleClose();
              handleClick();
            }}
          >
            <a href={`tel:+${state.mission.elder_phone_number}`}>
              <img src={whiteCallIcon} alt="call" />
              &nbsp; חייג עכשיו
            </a>
          </PrimaryBtn>
        </DialogActions>
      </Dialog>
    </>
  );
};
