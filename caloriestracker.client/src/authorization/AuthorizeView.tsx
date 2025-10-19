import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectUser, selectAuthLoading } from '../auth/Selectors';
import { checkAuthStart } from '../auth/AuthSlices';

type Props = {
    children: React.ReactNode;
};

const AuthorizeView: React.FC<Props> = ({ children }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectAuthLoading);

    useEffect(() => {
        dispatch(checkAuthStart());
    }, []);

    if (loading) return <p>Loading...</p>;
    if (user) return <>{children}</>;

    return <Navigate to="/login" replace />;
};

export default AuthorizeView;
