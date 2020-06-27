import React, { FC, useState } from "react";
import { DialogTitle, DialogContent } from "@material-ui/core/";
import { BackArrow } from "./BackArrow";

export const ModalContext = React.createContext<
  React.Dispatch<React.SetStateAction<number>>
>(() => 1);

export enum ModalTitleButtonType {
  NONE,
  BACK,
  CLOSE,
}

const BackButtonsMap: { [key: number]: FC<{ handleClick: any }> | null } = {
  [ModalTitleButtonType.NONE]: null,
  [ModalTitleButtonType.BACK]: BackArrow,
  [ModalTitleButtonType.CLOSE]: BackArrow,
};

export type ModalPage = {
  title: string;
  page: FC;
  titleButtonType: ModalTitleButtonType;
  handleClose?: any;
  pageToContinue?: number;
};

type ModalRendererProps = {
  startingPage: number;
  pages: { [key: number]: ModalPage };
};

export const ModalRenderer: FC<ModalRendererProps> = ({
  startingPage,
  pages,
}) => {
  const [pageNumber, setPageNumber] = useState(startingPage);
  const {
    page: Page,
    title,
    titleButtonType,
    handleClose,
    pageToContinue,
  } = pages[pageNumber];
  const TitleButton = BackButtonsMap[titleButtonType];

  const handleTitleButton = () => {
    if (pageToContinue) {
      setPageNumber(pageToContinue);
    } else {
      setPageNumber(startingPage);
      handleClose();
    }
  };
  return (
    <ModalContext.Provider value={setPageNumber}>
      <DialogTitle>
        <p className='terms-modal title'>
          {titleButtonType !== ModalTitleButtonType.NONE &&
            TitleButton !== null ? (
              <TitleButton handleClick={handleTitleButton} />
            ) : null}
          {title}
        </p>
      </DialogTitle>
      <DialogContent>
        <div className='buttons-container'>
          <Page />
        </div>
      </DialogContent>
    </ModalContext.Provider>
  );
};
