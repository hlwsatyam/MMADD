import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Typography
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '../services/affiliateApi';
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { Title } = Typography;

const CreateAffiliateModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (formData) => affiliateApi.createAffiliate(formData),
    onSuccess: () => {
      toast.success('Affiliate created successfully!');
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
    if (fileList.length === 0) {
      toast.error('Please upload an image');
      return;
    }

    const formData = new FormData();
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });
    formData.append('image', fileList[0].originFileObj);

    createMutation.mutate(formData);
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
      title={<Title level={4}>Create New Affiliate</Title>}
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

        <Form.Item label="Image" required>
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending}
          >
            Create Affiliate
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAffiliateModal;