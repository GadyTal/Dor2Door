import React, { FC } from 'react';

type Props = {
  title: string;
  content: string;
  last?: boolean;
};

export const Detail: FC<Props> = ({ title, content, last }) => (
  <div className={`detail-container ${last ? '' : 'border'}`}>
    <div className="title"> {title}</div>
    <div className="content"> {content}</div>
  </div>
);
