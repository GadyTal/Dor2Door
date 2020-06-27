import { useContext } from 'react';
import { StageContext } from '../core/StageRenderer';

export const usePageNavigation = () => {
  const pageNavigator = useContext(StageContext);
  return pageNavigator;
};
