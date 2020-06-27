import React, { useRef, useEffect, useState, FC } from 'react';
import {
  makeStyles,
  Dialog,
  DialogProps,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@material-ui/core/';
import { PrimaryBtn } from '../core';

type TermsModalProps = {
  executingElement: any;
};

export const TermsModal: FC<TermsModalProps> = ({ executingElement }) => {
  const [open, setOpen] = useState(false);
  // const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    // setScroll(scrollType);
  };

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

  const termsContent: content[] = [
    {
      title: 'הצהרת בריאות',
      content:
        'ררוטקסנוק ,טמא טיס רולוד םוספיא םרול ,טמא טיס רולוד םוספיא םרול תילא גניסיפידא.חשגרמו ישגרמ ,ףוקליס םודנדא דרפנומ סרולוק הלוק ףילחמע',
    },
    {
      title: 'מסירה',
      content:
        'ררוטקסנוק ,טמא טיס רולוד םוספיא םרול ,טמא טיס רולוד םוספיא םרול תילא גניסיפידא.חשגרמו ישגרמ ,ףוקליס םודנדא דרפנומ סרולוק הלוק ףילחמע',
    },
    {
      title: 'תשלום',
      content:
        'תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום ',
    },
    {
      title: 'תשלום',
      content:
        'תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום ',
    },
    {
      title: 'תשלום',
      content:
        'תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום ',
    },
    {
      title: 'תשלום',
      content:
        'תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום תשלום ',
    },
  ];
  const classes = makeStyles({
    root: {
      scrollbarColor: 'purple',
      msScrollbarTrackColor: 'red',
      borderRadius: '30px',
    },
  })();

  return (
    <div>
      <div onClick={handleClickOpen('paper')}>{executingElement}</div>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        PaperProps={{ classes: { root: classes.root } }}
      >
        <DialogTitle>
          <p className="terms-modal title">תקנון שימוש</p>
        </DialogTitle>
        <DialogContent dividers={true} style={{ direction: 'ltr' }}>
          <div className="scrollbar">
            {termsContent.map((item, index) => (
              <div key={index}>
                <p className="terms-modal p-title">
                  {index + 1}.{` ${item.title}`}
                </p>
                <p className="terms-modal p-content">{item.content}</p>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions style={{ placeContent: 'center' }}>
          <PrimaryBtn handleClick={handleClose}>חזרה</PrimaryBtn>
        </DialogActions>
      </Dialog>
    </div>
  );
};
