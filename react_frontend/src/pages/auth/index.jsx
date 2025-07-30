import { useState } from "react";
import LoginUI from "../../components/login";
import ForgotPassword from "../../components/forgot_password";

const Login = () => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    return (
        <div>
            <LoginUI forgotClicked={() => setShowForgotPassword(true)} />
            <ForgotPassword
                show={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />
        </div>
    );
};

export default Login;