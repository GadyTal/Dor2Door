import { useContext } from 'react';
import { AdminContext } from '../stages/admin/';

export const useAdminState = () => useContext(AdminContext);
