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
  Drawer,
  Descriptions
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteRowOutlined
} from '@ant-design/icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

const API_URL = `${process.env.REACT_APP_API_IMG_URL}/api/ads`;

const SimpleAdManagement = () => {
  // States
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Modal states
  const [createModal, setCreateModal] = useState(false);
  const [viewDrawer, setViewDrawer] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // Form states
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [createFileList, setCreateFileList] = useState([]);
  const [editFileList, setEditFileList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch ads
  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: { page, limit, status: statusFilter }
      });
      setAds(response.data.data);
      setTotal(response.data.pagination.total);
    } catch (error) {
      toast.error('Failed to fetch ads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [page, limit, statusFilter]);

  // Create ad
  const handleCreate = async (values) => {
    if (createFileList.length === 0) {
      toast.error('Please upload an image');
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('status', values.status || 'active');
    formData.append('image', createFileList[0]);

    try {
      await axios.post(API_URL, formData);
      toast.success('Ad created successfully!');
      setCreateModal(false);
      createForm.resetFields();
      setCreateFileList([]);
      fetchAds();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Creation failed');
    }
  };

  // Update ad
  const handleUpdate = async (id, values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('status', values.status);
    
    if (editFileList.length > 0) {
      formData.append('image', editFileList[0].originFileObj);
    }

    try {
      await axios.put(`${API_URL}/${id}`, formData);
      toast.success('Ad updated successfully!');
      setEditingId(null);
      editForm.resetFields();
      setEditFileList([]);
      fetchAds();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  // Delete ad
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Ad deleted successfully');
      fetchAds();
      setSelectedRowKeys([]);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      toast.error('Please select at least one ad');
      return;
    }
    
    confirm({
      title: 'Bulk Delete',
      content: `Delete ${selectedRowKeys.length} ads?`,
      onOk: async () => {
        try {
          await axios.post(`${API_URL}/bulk-delete`, { ids: selectedRowKeys });
          toast.success(`${selectedRowKeys.length} ads deleted`);
          fetchAds();
          setSelectedRowKeys([]);
        } catch (error) {
          toast.error('Bulk delete failed');
        }
      }
    });
  };

  // Toggle status
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      toast.success(`Status changed`);
      fetchAds();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image) => (
        <Image
          src={`${process.env.REACT_APP_API_IMG_URL}${image}`}
          width={60}
          height={60}
          className="rounded-lg object-cover"
          fallback="https://via.placeholder.com/60"
        />
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => {
        if (editingId === record._id) {
          return (
            <Input
              defaultValue={text}
              onChange={(e) => {
                const updated = { ...record, title: e.target.value };
                const newAds = ads.map(ad => 
                  ad._id === record._id ? updated : ad
                );
                setAds(newAds);
              }}
              size="small"
            />
          );
        }
        return <span className="font-medium">{text}</span>;
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => {
        if (editingId === record._id) {
          return (
            <Input
              defaultValue={text}
              onChange={(e) => {
                const updated = { ...record, description: e.target.value };
                const newAds = ads.map(ad => 
                  ad._id === record._id ? updated : ad
                );
                setAds(newAds);
              }}
              size="small"
            />
          );
        }
        return text ? (
          <Tooltip title={text}>
            <span>{text.substring(0, 30)}...</span>
          </Tooltip>
        ) : (
          <span className="text-gray-400">No description</span>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => {
        if (editingId === record._id) {
          return (
            <Select
              defaultValue={status}
              onChange={(value) => {
                const updated = { ...record, status: value };
                const newAds = ads.map(ad => 
                  ad._id === record._id ? updated : ad
                );
                setAds(newAds);
              }}
              size="small"
              style={{ width: 100 }}
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          );
        }
        return (
          <Tag color={status === 'active' ? 'success' : 'error'}>
            {status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            <span className="ml-1 capitalize">{status}</span>
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {editingId === record._id ? (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  handleUpdate(record._id, record);
                  setEditingId(null);
                }}
              >
                Save
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setEditingId(null);
                  fetchAds(); // Revert changes
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Tooltip title="View">
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => {
                    setSelectedAd(record);
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
                    setEditingId(record._id);
                    editForm.setFieldsValue({
                      title: record.title,
                      description: record.description,
                      status: record.status
                    });
                  }}
                />
              </Tooltip>
              <Tooltip title="Toggle Status">
                <Button
                  icon={record.status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                  size="small"
                  danger={record.status === 'active'}
                  onClick={() => toggleStatus(record._id, record.status)}
                />
              </Tooltip>
              <Popconfirm
                title="Delete this ad?"
                onConfirm={() => handleDelete(record._id)}
              >
                <Tooltip title="Delete">
                  <Button icon={<DeleteOutlined />} size="small" danger />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ];

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Upload props
  const getUploadProps = (fileList, setFileList) => ({
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        toast.error('Please upload an image');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error('Image must be less than 5MB');
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
    <div className="p-4 bg-gray-50 ">
      <Card className="shadow-md">
        {/* Simple Header */}  
          <Title level={5} className="text-indigo-600 m-0">
            Ad Management
          </Title>
        <div className="flex justify-between items-center mb-4">
      
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchAds}>
              Refresh
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button
                icon={<DeleteRowOutlined />}
                danger
                onClick={handleBulkDelete}
              >
                Delete ({selectedRowKeys.length})
              </Button>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModal(true)}
            >
              Add Ad
            </Button>
          </Space>
        </div>

        {/* Simple Filter */}
        <div className="flex justify-between items-center mb-4">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            size="middle"
          >
            <Option value="all">All Ads</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          <span className="text-gray-500">Total: {total} ads</span>
        </div>

        {/* Simple Table */}
        <Table
        scroll={{x:true}}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={ads}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPage(page);
              setLimit(pageSize);
            }
          }}
          size="middle"
          bordered
        />
      </Card>

      {/* Simple Create Modal */}
      <Modal
        title="Add New Ad"
        open={createModal}
        onCancel={() => {
          setCreateModal(false);
          createForm.resetFields();
          setCreateFileList([]);
        }}
        footer={null}
        width={450}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={2} placeholder="Enter description (optional)" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="active"
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Image" required>
            <Upload {...getUploadProps(createFileList, setCreateFileList)} listType="picture">
              <Button icon={<UploadOutlined />}>Select Image</Button>
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

      {/* Simple View Drawer */}
      <Drawer
        title="Ad Details"
        open={viewDrawer}
        onClose={() => {
          setViewDrawer(false);
          setSelectedAd(null);
        }}
        width={400}
      >
        {selectedAd && (
          <div>
            <div className="flex justify-center mb-4">
              <Image
                src={`${process.env.REACT_APP_API_IMG_URL}${selectedAd.image}`}
                width={200}
                height={200}
                className="rounded-lg object-cover border"
              />
            </div>

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Title">
                <strong>{selectedAd.title}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Description">
                {selectedAd.description || 'No description'}
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Tag color={selectedAd.status === 'active' ? 'success' : 'error'}>
                  {selectedAd.status}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Created">
                {new Date(selectedAd.createdAt).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default SimpleAdManagement;