import React, { FC } from "react";
import { PrimaryBtn, SecondaryBtn, MainImage } from "../../../core";
// import { useMissionState } from "../../../hooks";
import shareWhiteIcon from "../../../../assets/icons/share.png";
import { EndingQuote } from "../subComponents/EndingQuote";
import { useHistory } from "react-router-dom";

//all kinds of the endMission's contents
enum EndMissionTypes {
  MissionCompleted,
  MissionHasTaken,
  MissionStopped,
  error
};

type Props = {
  endType: EndMissionTypes;
}

export const EndOfMission: FC<Props> = ({ endType }) => {
  // const { mission, volunteer } = useMissionState();
  const history = useHistory();
  // For typescript
  let newVariable: any;
  newVariable = window.navigator;

  type EndOfMissionFields = {
    title: string,
    share: boolean,
    decsription: string
  }

  const EndMissionsDictionary: { [key in EndMissionTypes]: EndOfMissionFields } = {
    [EndMissionTypes.MissionCompleted]: { title: 'תודה רבה!', share: true, decsription: 'ההתנדבות הסתיימה בהצלחה!😊' },
    [EndMissionTypes.MissionStopped]: { title: 'תודה בכל מקרה!', share: false, decsription: 'מקווים שפעם הבאה תוכל לסייע😊' },
    [EndMissionTypes.MissionHasTaken]: { title: 'תודה בכל מקרה!', share: false, decsription: 'נראה כי מתנדב אחר כבר מטפל בבקשה.😊' },
    [EndMissionTypes.error]: { title: 'תודה בכל מקרה!', share: false, decsription: 'אופס, קרתה טעות. מטפלים בזה 😊' }
  }

  const shareActivity = () => {
    const shareData = {
      title: 'Door2Dor !!!',
      text: 'גם אני התנדבתי!!!!!',
      url: 'https://door2dor.co.il',
    }
    newVariable.share(shareData).then(() => history.push("../homepage"));
  }

  return (
    <div className="mission-component-container page-padding">

      <div className='description-container'>
        <div className='title'>
          {EndMissionsDictionary[endType].title}
        </div>
        <p className="medium-text narrow">{EndMissionsDictionary[endType].decsription}</p>
        <MainImage componentName='MissionStopped' customizedheight="30vh" customizedwidth="auto" />
        <EndingQuote />
      </div>

      <div className='buttons-container'>
        {EndMissionsDictionary[endType].share && newVariable.share ?
          <PrimaryBtn handleClick={() => shareActivity()}>
            <img src={shareWhiteIcon} alt='thanks' style={{ height: "4vh" }} /> &nbsp; שיתוף
        </PrimaryBtn> : null}
        <SecondaryBtn handleClick={() => { history.push("../homepage") }}>
          דף הבית
        </SecondaryBtn>
      </div>
    </div>
  );
};




export const MissionStopped: FC = () => <EndOfMission endType={EndMissionTypes.MissionStopped} />
export const MissionHasTaken: FC = () => <EndOfMission endType={EndMissionTypes.MissionHasTaken} />
export const MissionCompleted: FC = () => <EndOfMission endType={EndMissionTypes.MissionCompleted} />

//MissionError is mapping depends on the error type
export const MissionError: FC<{ errorType: number }> = ({ errorType }) => {

  const RenderedComponent = () => {
    switch (errorType) {
      case 401: ////unauthorized
        return <EndOfMission endType={EndMissionTypes.error} />
      case 403: //"Mission does not belong to volunteer"    &&     "Volunteer mission is not {state}"
      case 404: //"No such mission"
        return <EndOfMission endType={EndMissionTypes.MissionHasTaken} />
      default:
        return <EndOfMission endType={EndMissionTypes.error} />
    }
  }
  return <RenderedComponent />;
}
