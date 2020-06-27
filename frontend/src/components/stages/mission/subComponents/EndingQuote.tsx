import React from 'react';

import marksUp from '../../../../assets/icons/quotation-marks-up.png';
import marksdown from '../../../../assets/icons/quotation-marks-down.png';

export const EndingQuote = () => (
  <div className="quote-container">
    <img src={marksUp} className="marks-up" alt="marks" />
    <div className="text">
      מעשה נדיב, קטן ככל שיהיה, <br /> לעולם אינו מתבזבז
    </div>
    <img src={marksdown} className="marks-down" alt="marks" />
  </div>
);
