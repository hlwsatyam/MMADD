  
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Typography, Space } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onGoogleSuccess = async (response) => {
    try {
      console.log('Google login success:', response);
      const userData = await login(response.credential);
      
      toast.success('Login successful!');
      
      // Navigate based on profile completion
      if (!userData.profileCompleted) {
        navigate('/complete-profile');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    }
  };

  const onGoogleFailure = (error) => {
    console.error('Google login failed:', error);
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            Welcome Back
          </Title>
          <Text type="secondary" className="text-gray-600">
            Sign in to continue to Social Marketplace
          </Text>
        </div>

        <div className="space-y-6">
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            render={renderProps => (
              <Button
                type="default"
                size="large"
                icon={<GoogleOutlined />}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="w-full h-12 text-base border-gray-300 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center"
              >
                Continue with Google
              </Button>
            )}
            buttonText="Continue with Google"
            onSuccess={onGoogleSuccess}
            onFailure={onGoogleFailure}
            cookiePolicy={'single_host_origin'}
            scope="profile email"
            prompt="select_account"
          />

          <div className="text-center">
            <Text type="secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </Text>
          </div>

          <div className="text-center">
            <Text type="secondary" className="text-xs">
              By continuing, you agree to our Terms and Privacy Policy
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;