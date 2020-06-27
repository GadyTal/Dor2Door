import { useContext } from 'react';
import { HomepageContext } from '../stages/homepage/';

export const useHomepageState = () => useContext(HomepageContext);
