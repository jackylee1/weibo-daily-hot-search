import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";


const Page = async () => {
    await requireUnauth();
    return (

        <RegisterForm />

    );
    //<div> 
    //<RegisterForm />
    //</div>



};
export default Page;
