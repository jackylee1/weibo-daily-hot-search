import Image from "next/image";
import Link from "next/link";
import { AuthLayout } from "@/features/auth/components/auth-layout"


//import { AuthLayout } from "@/features/auth/components/auth-layout"
const Layout = ({ children }: { children: React.ReactNode }) => {

    return (
        <AuthLayout>
            {children}
        </AuthLayout>



    );
};
export default Layout
