import React from 'react';
import {
  Modal,
  Descriptions,
  Image,
  Tag,
  Button,
  Space,
  Typography
} from 'antd';
import {
  CopyOutlined,
  MailOutlined,
  PhoneOutlined,
  LinkOutlined,
  CalendarOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { affiliateApi } from '../services/affiliateApi';
import toast from 'react-hot-toast';

const { Title } = Typography;

const ViewAffiliateModal = ({ visible, onClose, affiliate }) => {
  if (!affiliate) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliate.affiliateLink);
      await affiliateApi.trackClick(affiliate._id);
      toast.success('Link copied! Click tracked.');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Modal
      title={<Title level={4}>Affiliate Details</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={700}
    >
      <div className="flex justify-center mb-6">
        <Image
          src={`${process.env.REACT_APP_API_IMG_URL}${affiliate.image}`}
          alt={affiliate.name}
          width={200}
          height={200}
          className="rounded-lg object-cover border-4 border-indigo-100"
          fallback="https://via.placeholder.com/200"
        />
      </div>

      <Descriptions bordered column={2} className="mt-4">
        <Descriptions.Item label="Name" span={2}>
          <span className="font-semibold text-lg">{affiliate.name}</span>
        </Descriptions.Item>

        <Descriptions.Item label="Email">
          <Space>
            <MailOutlined className="text-indigo-500" />
            <span>{affiliate.email}</span>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Phone">
          <Space>
            <PhoneOutlined className="text-indigo-500" />
            <span>{affiliate.phone}</span>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Status" span={2}>
          <Tag color={affiliate.status === 'active' ? 'success' : 'error'}>
            {affiliate.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Clicks" span={2}>
          <Space>
            <EyeOutlined className="text-indigo-500" />
            <span className="font-semibold text-lg">{affiliate.clicks}</span>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Affiliate Link" span={2}>
          <Space direction="vertical" className="w-full">
            <div className="flex items-center gap-2">
              <LinkOutlined className="text-indigo-500" />
              <a href={affiliate.affiliateLink} target="_blank" rel="noopener noreferrer">
                {affiliate.affiliateLink}
              </a>
            </div>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              size="small"
              onClick={handleCopyLink}
            >
              Copy Link
            </Button>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Created At" span={2}>
          <Space>
            <CalendarOutlined className="text-indigo-500" />
            <span>{new Date(affiliate.createdAt).toLocaleString()}</span>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Description" span={2}>
          <div className="bg-gray-50 p-3 rounded">
            {affiliate.description}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewAffiliateModal;