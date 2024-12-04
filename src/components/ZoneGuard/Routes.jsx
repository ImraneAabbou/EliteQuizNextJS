"use client"
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RiseLoader } from "react-spinners";
import { authRoutes, protectedRoutes } from "src/routes/routes";
import { LoadWebSettingsDataApi } from "src/store/reducers/webSettings";


const Routes = ({ children }) => {

    const userData = useSelector(state => state.User)

    // Check if the user is authenticated based on the presence of the token
    const isAuthenticated = userData.token

    const navigate = useRouter()

    const [loading, setLoading] = useState(true);

    const pathname = usePathname();

    // Check if the given pathname matches any of the patterns
    const isRouteProtected = (pathname) => {
        return pathname && protectedRoutes.some(pattern => pathname.startsWith(pattern));
    };

    // Check if the current route requires authentication
    // const requiresAuth = protectedRoutes.includes(pathname)
    const requiresAuth = isRouteProtected(pathname);

    useEffect(() => {
        LoadWebSettingsDataApi(
            () => { setLoading(false); },
            (error) => { console.log(error) }
        )
    }, [loading])


    useEffect(() => {
        authCheck()
    }, [requiresAuth, pathname])

    const authCheck = () => {
        if (requiresAuth) {
            if (isAuthenticated === null) {
                navigate.push('/auth/login')
                toast.error('Please login first')
                return
            }
        }
    }

    // Check if the current route is an authentication route
    const isAuthRoute = authRoutes.includes(pathname)

    useEffect(() => {
        notAccessAfterLogin()
    }, [isAuthRoute])

    const notAccessAfterLogin = () => {
        if (isAuthenticated) {
            if (isAuthRoute) {
                navigate.push('/')
            }
        }
    }

    const loaderstyles = {
        loader: {
            textAlign: 'center',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        },
        img: {
            maxWidth: '100%',
            maxHeight: '100%'
        }
    }

    return (

        <div>
            {loading ? (
                <Suspense fallback>
                    <div className='loader' style={loaderstyles.loader}>
                        <RiseLoader className='inner_loader' style={loaderstyles.img} />
                    </div>
                </Suspense>
            ) : ( children )
            }</div>
    )
}

export default Routes