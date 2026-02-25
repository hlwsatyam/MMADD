import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout, Row, Col, Card, Image, Typography, Tag, Button, Input, Select, Spin, Pagination } from 'antd';
import { PhoneOutlined, HeartOutlined, SearchOutlined } from '@ant-design/icons';
import { getPostsByCategory } from '../api/posts';
import { getImageUrl } from '../api/upload';
import BottomNavigation from '../components/BottomNavigation';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['categoryPosts', category, search, sortBy, page],
    queryFn: () => getPostsByCategory(category, { 
      search, 
      page, 
      sortBy,
      limit: pageSize
    }),
    enabled: !!category,
  });

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const categoryColors = {
    electronics: 'blue',
    fashion: 'pink',
    home: 'green',
    vehicles: 'orange',
    property: 'purple',
    services: 'cyan',
    others: 'gray'
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="pt-20 px-4 pb-24 max-w-6xl mx-auto">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <Title level={2} className="capitalize mb-2">{category}</Title>
              {categoryData?.totalPosts && (
                <Text type="secondary">
                  {categoryData.totalPosts} products available
                </Text>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <Input
                placeholder={`Search in ${category}...`}
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64"
              />
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 180 }}
              >
                <Option value="newest">Newest First</Option>
                <Option value="price-low">Price: Low to High</Option>
                <Option value="price-high">Price: High to Low</Option>
                <Option value="views">Most Viewed</Option>
              </Select>
            </div>
          </div>

          <Tag 
            color={categoryColors[category] || 'blue'} 
            style={{ fontSize: '16px', padding: '8px 16px' }}
          >
            {category.toUpperCase()}
          </Tag>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Spin size="large" />
            <Text className="text-gray-500 mt-4 block">Loading {category} products...</Text>
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {categoryData?.posts?.map(post => (
                <Col xs={24} sm={12} lg={8} key={post._id}>
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      <div className="h-48 overflow-hidden">
                        <Image
                          alt={post.title}
                          src={getImageUrl(post.images[0])}
                          className="w-full h-full object-cover"
                          preview={false}
                        />
                      </div>
                    }
                    onClick={() => navigate(`/post/${post._id}`)}
                  >
                    <div className="h-32 flex flex-col justify-between">
                      <Text strong className="line-clamp-2 mb-2">{post.title}</Text>
                      <Text className="text-gray-600 line-clamp-2 mb-2 text-sm">
                        {post.description}
                      </Text>
                      <div>
                        <div className="flex justify-between items-center">
                          <Title level={5} className="mb-0 text-green-600">
                            ₹{post.price.toLocaleString()}
                          </Title>
                          <Text type="secondary" className="text-sm">
                            {post.location?.city}
                          </Text>
                        </div>
                        <Button
                          type="primary"
                          icon={<PhoneOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCall(post.contactNumber);
                          }}
                          size="small"
                          className="w-full mt-2"
                        >
                          Contact Seller
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {categoryData?.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={page}
                  total={categoryData?.totalPosts || 0}
                  pageSize={pageSize}
                  onChange={(newPage) => setPage(newPage)}
                  showSizeChanger={false}
                />
              </div>
            )}

            {categoryData?.posts?.length === 0 && (
              <div className="text-center py-12">
                <Title level={4} className="text-gray-500">No products found</Title>
                <Text type="secondary" className="block mb-4">
                  {search ? `No results for "${search}"` : `Be the first to post in ${category} category!`}
                </Text>
                <Button 
                  type="primary"
                  onClick={() => navigate('/create-post')}
                >
                  Post Your Product
                </Button>
              </div>
            )}
          </>
        )}
      </Content>
      <BottomNavigation />
    </Layout>
  );
};

export default CategoryPage;