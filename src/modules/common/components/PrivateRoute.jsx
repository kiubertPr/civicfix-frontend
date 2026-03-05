import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as users from '../../users';

const PrivateRoute = ({ element, adminRoute=false }) => {
  const user = useSelector(users.default.selectors.getUser);
  const isAdmin = user && user.role && user.role === 'ADMIN';
  if (user && adminRoute && !isAdmin) {
    return <Navigate to="/login" />;
  }
  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;