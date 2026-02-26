import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  Upload,
  Image,
  Popconfirm,
  Tooltip,
  Card,
  Typography,
  Badge,
  Drawer,
  Descriptions,
  message
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CopyOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteRowOutlined,
  LinkOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

const API_URL = `${process.env.REACT_APP_API_IMG_URL}/api/affiliates`;
 
const CompleteAffiliatePage = () => {
  // ========== STATES ==========
  // Table states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Modal states
  const [createModal, setCreateModal] = useState(false);
  const [editDrawer, setEditDrawer] = useState(false);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);

  // Form states
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [createFileList, setCreateFileList] = useState([]);
  const [editFileList, setEditFileList] = useState([]);

  // ========== FETCH DATA ==========
  const fetchAffiliates = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        status: statusFilter
      };
      const response = await axios.get(API_URL, { params });
      setData(response.data.data);
      setTotal(response.data.pagination.total);
    } catch (error) {
      toast.error('Failed to fetch affiliates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, [page, limit, search, statusFilter]);

  // ========== CREATE AFFILIATE ==========
  const handleCreate = async (values) => {
    if (createFileList.length === 0) {
      toast.error('Please upload an image');
      return;
    }
 
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });
    formData.append('image', createFileList[0]);

    try {
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Affiliate created successfully!');
      setCreateModal(false);
      createForm.resetFields();
      setCreateFileList([]);
      fetchAffiliates();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Creation failed');
    }
  };

  // ========== UPDATE AFFILIATE ==========
  const handleUpdate = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });
    
    if (editFileList.length > 0) {
      formData.append('image', editFileList[0].originFileObj);
    }

    try {
      await axios.put(`${API_URL}/${selectedAffiliate._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Affiliate updated successfully!');
      setEditDrawer(false);
      editForm.resetFields();
      setEditFileList([]);
      fetchAffiliates();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  // ========== DELETE AFFILIATE ==========
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Affiliate deleted successfully');
      fetchAffiliates();
      setSelectedRowKeys([]);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // ========== BULK DELETE ==========
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      toast.error('Please select at least one affiliate');
      return;
    }
    
    confirm({
      title: 'Bulk Delete',
      content: `Are you sure you want to delete ${selectedRowKeys.length} affiliates?`,
      onOk: async () => {
        try {
          await axios.post(`${API_URL}/bulk-delete`, { ids: selectedRowKeys });
          toast.success(`${selectedRowKeys.length} affiliates deleted`);
          fetchAffiliates();
          setSelectedRowKeys([]);
        } catch (error) {
          toast.error('Bulk delete failed');
        }
      }
    });
  };

  // ========== UPDATE STATUS ==========
  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus });
      toast.success(`Status changed to ${newStatus}`);
      fetchAffiliates();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  // ========== COPY LINK & TRACK ==========
  const handleCopyLink = async (link, id) => {
    try {
      await navigator.clipboard.writeText(link);
      await axios.post(`${API_URL}/${id}/track`);
      toast.success('Link copied! Click tracked.');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // ========== TABLE COLUMNS ==========
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image) => (
        <Image
          src={`${process.env.REACT_APP_API_IMG_URL}${image}`}
          width={50}
          height={50}
          className="rounded-lg object-cover"
          fallback="https://via.placeholder.com/50"
        />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span className="font-medium">{text}</span>
          <span className="text-xs text-gray-500">{record.email}</span>
        </Space>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 120
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      width: 80,
      render: (clicks) => (
        <Badge count={clicks} showZero color="blue" />
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          <span className="ml-1 capitalize">{status}</span>
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                setSelectedAffiliate(record);
                setViewDrawer(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
              onClick={() => {
                setSelectedAffiliate(record);
                editForm.setFieldsValue({
                  name: record.name,
                  email: record.email,
                  phone: record.phone,
                  affiliateLink: record.affiliateLink,
                  description: record.description,
                  status: record.status
                });
                setEditDrawer(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Copy Link">
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => handleCopyLink(record.affiliateLink, record._id)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
            <Button
              icon={record.status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
              size="small"
              danger={record.status === 'active'}
              onClick={() => handleStatusUpdate(record._id, record.status)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Affiliate?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // ========== ROW SELECTION ==========
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // ========== UPLOAD PROPS ==========
  const getUploadProps = (fileList, setFileList) => ({
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
  });

  return (
    <div className="p-6 bg-gray-50  ">
      {/* Main Card */}
      <Card className="shadow-xl">
        {/* Header */}
  <Title level={4} className="text-indigo-600 m-0">
            Affiliate Management
          </Title>


        <div className="flex justify-between items-center mb-6">
        
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAffiliates}
            >
              Refresh
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button
                icon={<DeleteRowOutlined />}
                danger
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedRowKeys.length})
              </Button>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModal(true)}
            >
              Add Affiliate
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search by name, email, phone"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full"
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active Only</Option>
            <Option value="inactive">Inactive Only</Option>
          </Select>
          <div className="text-right text-gray-500">
            Total: {total} affiliates
          </div>
        </div>

        {/* Table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: (page, pageSize) => {
              setPage(page);
              setLimit(pageSize);
            }
          }}
          scroll={{ x: 1200 }}
          className="border rounded-lg"
        />
      </Card>

      {/* ========== CREATE MODAL ========== */}
      <Modal
        title={<Title level={4}>Create New Affiliate</Title>}
        open={createModal}
        onCancel={() => {
          setCreateModal(false);
          createForm.resetFields();
          setCreateFileList([]);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Name required' }]}
          >
            <Input placeholder="Enter name" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email required' },
              { type: 'email', message: 'Invalid email' }
            ]}
          >
            <Input placeholder="Enter email" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Phone required' }]}
          >
            <Input placeholder="Enter phone" size="large" />
          </Form.Item>

          <Form.Item
            name="affiliateLink"
            label="Affiliate Link"
            rules={[{ required: true, message: 'Link required' }]}
          >
            <Input placeholder="Enter affiliate link" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Description required' }]}
          >
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item label="Image" required>
            <Upload {...getUploadProps(createFileList, setCreateFileList)} listType="picture">
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setCreateModal(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== EDIT DRAWER ========== */}
      <Drawer
        title={<Title level={4}>Edit Affiliate</Title>}
        open={editDrawer}
        onClose={() => {
          setEditDrawer(false);
          editForm.resetFields();
          setEditFileList([]);
        }}
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="affiliateLink"
            label="Affiliate Link"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item label="New Image">
            <Upload {...getUploadProps(editFileList, setEditFileList)} listType="picture">
              <Button icon={<UploadOutlined />}>Upload New Image</Button>
            </Upload>
            {selectedAffiliate?.image && !editFileList.length && (
              <div className="mt-2">
                <img
                  src={`${process.env.REACT_APP_API_IMG_URL}${selectedAffiliate.image}`}
                  alt="Current"
                  className="w-20 h-20 object-cover rounded"
                />
                <span className="ml-2 text-gray-500">Current Image</span>
              </div>
            )}
          </Form.Item>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" block>
              Update Affiliate
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      {/* ========== VIEW DRAWER ========== */}
      <Drawer
        title={<Title level={4}>Affiliate Details</Title>}
        open={viewDrawer}
        onClose={() => {
          setViewDrawer(false);
          setSelectedAffiliate(null);
        }}
        width={500}
      >
        {selectedAffiliate && (
          <div>
            <div className="flex justify-center mb-6">
              <Image
                src={`${process.env.REACT_APP_API_IMG_URL}${selectedAffiliate.image}`}
                width={200}
                height={200}
                className="rounded-lg object-cover border-4 border-indigo-100"
              />
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Name">
                <span className="font-semibold text-lg">{selectedAffiliate.name}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                <Space>
                  <MailOutlined className="text-indigo-500" />
                  {selectedAffiliate.email}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                <Space>
                  <PhoneOutlined className="text-indigo-500" />
                  {selectedAffiliate.phone}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Tag color={selectedAffiliate.status === 'active' ? 'success' : 'error'}>
                  {selectedAffiliate.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Clicks">
                <Badge count={selectedAffiliate.clicks} showZero color="blue" />
              </Descriptions.Item>

              <Descriptions.Item label="Affiliate Link">
                <Space direction="vertical">
                  <LinkOutlined />
                  <a href={selectedAffiliate.affiliateLink} target="_blank">
                    {selectedAffiliate.affiliateLink}
                  </a>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Created">
                <Space>
                  <CalendarOutlined />
                  {new Date(selectedAffiliate.createdAt).toLocaleString()}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Description">
                <div className="bg-gray-50 p-3 rounded">
                  {selectedAffiliate.description}
                </div>
              </Descriptions.Item>
            </Descriptions>

            <div className="mt-4 flex gap-2">
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={() => handleCopyLink(selectedAffiliate.affiliateLink, selectedAffiliate._id)}
                block
              >
                Copy Link & Track Click
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CompleteAffiliatePage;