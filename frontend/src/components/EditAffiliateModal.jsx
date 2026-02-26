import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Typography,
  Select
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../services/affiliateApi';
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const EditAffiliateModal = ({ visible, onClose, affiliate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (affiliate) {
      form.setFieldsValue({
        name: affiliate.name,
        email: affiliate.email,
        phone: affiliate.phone,
        affiliateLink: affiliate.affiliateLink,
        description: affiliate.description,
        status: affiliate.status
      });
    }
  }, [affiliate, form]);

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => affiliateApi.updateAffiliate(id, formData),
    onSuccess: () => {
      toast.success('Affiliate updated successfully!');
      queryClient.invalidateQueries(['affiliates']);
      form.resetFields();
      setFileList([]);
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });
    
    if (fileList.length > 0) {
      formData.append('image', fileList[0].originFileObj);
    }

    updateMutation.mutate({ id: affiliate._id, formData });
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        toast.error('Please upload an image file');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error('Image must be smaller than 5MB');
        return false;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
    accept: 'image/*'
  };

  return (
    <Modal
      title={<Title level={4}>Edit Affiliate</Title>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input placeholder="Enter affiliate name" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter valid email' }
          ]}
        >
          <Input placeholder="Enter email" size="large" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please enter phone' }]}
        >
          <Input placeholder="Enter phone number" size="large" />
        </Form.Item>

        <Form.Item
          name="affiliateLink"
          label="Affiliate Link"
          rules={[{ required: true, message: 'Please enter affiliate link' }]}
        >
          <Input placeholder="Enter affiliate link" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item label="New Image (optional)">
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>Upload New Image</Button>
          </Upload>
          {affiliate?.image && !fileList.length && (
            <div className="mt-2">
              <img
                src={`http://localhost:5000${affiliate.image}`}
                alt="Current"
                className="w-20 h-20 object-cover rounded"
              />
              <span className="ml-2 text-gray-500">Current Image</span>
            </div>
          )}
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateMutation.isPending}
          >
            Update Affiliate
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAffiliateModal;