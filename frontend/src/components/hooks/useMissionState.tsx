import { useContext } from 'react';
import { MissionContext } from '../stages/mission';

export const useMissionState = () => useContext(MissionContext);
