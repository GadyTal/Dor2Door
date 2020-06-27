import React, { FC, useState } from 'react';

export const StageContext = React.createContext<
  React.Dispatch<React.SetStateAction<number>>
>(() => 1);

type StageRendererProps = {
  startingPage: number;
  pages: { [key: number]: FC };
  wrapperClass?: string;
};

export const StageRenderer: FC<StageRendererProps> = ({
  startingPage,
  pages,
  wrapperClass,
}) => {
  const [pageNumber, setPageNumber] = useState(startingPage);
  const Page = pages[pageNumber];
  return (
      <StageContext.Provider value={setPageNumber}>
        <div className={wrapperClass}>
          <Page />
        </div>
      </StageContext.Provider>
  );
};

StageRenderer.defaultProps = {
  wrapperClass: '',
};
