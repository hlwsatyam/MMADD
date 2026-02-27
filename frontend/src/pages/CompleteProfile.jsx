import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, Select, message, Radio } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { completeProfile } from '../api/user';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pincodeData, setPincodeData] = useState(null);

  const [form] = Form.useForm();

  const checkPincode = async (pincode) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0].Status === 'Success') {
          setPincodeData(data[0]);
          form.setFieldsValue({
            state: data[0].PostOffice[0].State,
            city: data[0].PostOffice[0].District
          });
        } else {
          form.setFields([
            { name: 'pincode', errors: ['Invalid pincode'] }
          ]);
        }
      } catch (error) {
        console.error('Error fetching pincode data:', error);
      }
    }
  };

  const {   isPending,  mutate: completeProfileMutation } = useMutation({
    mutationFn: completeProfile,
    onSuccess: (data) => {
      updateUser(data);
      toast.success('Profile completed successfully!');
      navigate('/');
    },
    onError: (error) => {
 
      toast.error( error );
    }
  });

  const onFinish = async (values) => {
    setLoading(true);
    completeProfileMutation(values);
    setLoading(false);
  };

  const casteOptions = [
  "बुला वाले",
  "बेलिम",
  "भाड़ वाले",
  "भूरा वाले",
  "चौद वाले",
  "चौहान",
  "छावनी वाले",
  "छोट वाले",
  "दिलवाली",
  "गहलोत",
  "गोती",
  "गवाड़ वाले",
  "जिन्दरान",
  "हाले वाले",
  "हसे वाले",
  "कल्ला वाले",
  "कसाना (कसाई)",
  "कालू वाले",
  "खलीफा (नाई)",
  "खाट वाले",
  "मंडल",
  "मस्तान वाले",
  "मिया",
  "मेदा वाले",
  "मोड़न वाले",
  "नवाब वाले",
  "नाड़ा वाले",
  "निजाम वाले",
  "नूरा वाले",
  "युवांगी",
  "पोराजी वाले",
  "पत्ता वाले",
  "पोल वाले",
  "फूल वाले",
  "राबड़िया",
  "सावन वाले",
  "सिविली (साई)",
  "सूर वाले",
  "तारा वाले",
  "उस्मान वाले",
  "यार वाले"
];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800">
            Complete Your Profile
          </Title>
          <Text type="secondary">
            Please fill in your details to continue
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            email: user?.email,
            firstName: user?.firstName,
            lastName: user?.lastName
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input size="large" placeholder="Enter first name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input size="large" placeholder="Enter last name" />
            </Form.Item>



<Form.Item
  label="क्या आप नौकरी की तलाश कर रहे हैं?"
  name="lookingForJob"
  rules={[{ required: true, message: 'कृपया एक विकल्प चुनें' }]}
>
  <Radio.Group>
    <Radio value="yes">हाँ</Radio>
    <Radio value="no">नहीं</Radio>
  </Radio.Group>
</Form.Item>

 




            <Form.Item
              label="Mobile Number"
              name="mobileNumber"
              rules={[
                { required: true, message: 'Please enter mobile number' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10 digit number' }
              ]}
            >
              <Input size="large" placeholder="Enter mobile number" maxLength={10} />
            </Form.Item>

            <Form.Item
              label="Caste"
              name="caste"
              rules={[{ required: true, message: 'Please select caste' }]}
            >
              <Select showSearch size="large" placeholder="Select caste">
                {casteOptions.map(caste => (
                  <Option key={caste} value={caste}>{caste}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[
                { required: true, message: 'Please enter pincode' },
                { pattern: /^[0-9]{6}$/, message: 'Please enter valid 6 digit pincode' }
              ]}
            >
              <Input 
                size="large" 
                placeholder="Enter pincode" 
                maxLength={6}
                onChange={(e) => checkPincode(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="State"
              name="state"
            >
              <Input size="large" placeholder="State" disabled />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
            >
              <Input size="large" placeholder="City" disabled />
            </Form.Item>

            <Form.Item
              label="Village"
              name="village"
              rules={[{ required: true, message: 'Please enter village' }]}
            >
              <Input size="large" placeholder="Enter village" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please enter address' }]}
              className="md:col-span-2"
            >
              <Input.TextArea 
                rows={3} 
                size="large" 
                placeholder="Enter complete address" 
              />
            </Form.Item>
          </div>





    <Form.Item
              label="Busines  Address"
              name="businessAddress"
              rules={[{ required: true, message: 'Please Business address' }]}
              className="md:col-span-2"
            >
              <Input.TextArea 
                rows={3} 
                size="large" 
                placeholder="Enter Business address" 
              />
            </Form.Item>


          <Form.Item className="text-center mt-8">
            <Space>
              <Button 
                type="primary" 
                size="large" 
                htmlType="submit"
                loading={ loading || isPending}
                className="px-8"
              >
                Complete Profile
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CompleteProfile;