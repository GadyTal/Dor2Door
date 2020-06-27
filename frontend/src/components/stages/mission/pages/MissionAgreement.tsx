import React, { FC } from 'react';
import { PrimaryBtn, MainImage } from '../../../core';
import { usePageNavigation, useMissionState } from '../../../hooks';
import { PAGES } from '..';

import { TermsModal, OptionsModal } from '../../../modals/';
import { DeclineReason } from '../../../../shared/Contracts';

export const MissionAgreement: FC = () => {
  const pageNavigator = usePageNavigation();
  const missionState = useMissionState();
  const termsLabel = <div className="terms-button">לפירוט המלא של התקנון</div>;
  const termsSmallLabel = (
    <div className="super-small-text">
      לחיצה על כפתור זה מהווה הסכמה &nbsp;
      <label className="terms-button-small">לתנאי השירות</label>
    </div>
  );

  return (
    <>
      <div className="title">לפני שמתחילים</div>
      <MainImage componentName="MissionAgreement" customizedheight="34vh" />
      <div className="small-text">
        כמה דברים פורמלים קטנים כדי
        <br />
        לשמור על הביטחון שלך ושל הזקוק לסיוע.
      </div>
      <TermsModal executingElement={termsLabel} />
      <div className="buttons-container">
        <TermsModal executingElement={termsSmallLabel} />

        <PrimaryBtn handleClick={() => pageNavigator(PAGES.MAKE_A_CALL)}>
          יאללה אני מוכן
        </PrimaryBtn>
        {missionState ? <OptionsModal
          title="בטוח?"
          elementTag="Secondary"
          cancellationOptions={[{ stringValue: 'כן, אני בטוח', reason: DeclineReason.refuse }]}
          closeBtn="PrimaryBtn"
          description="הבקשה תעבור למתנדבים אחרים"
          missionId={missionState.missionId}
        >
          ביטול
        </OptionsModal> : null}
      </div>
    </>
  );
};
