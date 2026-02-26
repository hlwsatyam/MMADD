// import React, { useState } from 'react';
// import { Layout, Input, Card, Button, Row, Col, Typography, Tag, Image, Modal } from 'antd';
// import { SearchOutlined, PhoneOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
// import { useQuery } from '@tanstack/react-query';
// import { getPosts } from '../api/posts';
// import BottomNavigation from '../components/BottomNavigation';
// import { getImageUrl } from '../api/upload'; 
// const { Header, Content } = Layout;
// const { Title, Text } = Typography;
// const { Meta } = Card;

// const Home = () => {
//   const [search, setSearch] = useState('');
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const { data: postsData, isLoading } = useQuery({
//     queryKey: ['posts', search],
//     queryFn: () => getPosts({ search }),
//     refetchOnWindowFocus: false
//   });

//   const handleCall = (phoneNumber) => {
//     window.location.href = `tel:${phoneNumber}`;
//   };

//   const handlePostClick = (post) => {
//     setSelectedPost(post);
//     setModalVisible(true);
//   };

//   const categoryColors = {
//     electronics: 'blue',
//     fashion: 'pink',
//     home: 'green',
//     vehicles: 'orange',
//     property: 'purple',
//     services: 'red',
//     others: 'gray'
//   };

//   return (
//     <Layout className="min-h-screen">
//       <Header className="bg-white shadow-sm px-4">
       
//           <Title level={4} className="mb-0 text-gray-800">Nagori Bajar</Title>
//           <Input
//             size="large"
//             placeholder="Search products..."
//             prefix={<SearchOutlined />}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="mt-4 rounded-full"
//           />
        
//       </Header>

//       <Content className="p-4 mt-12  mx-auto  ">
//         {isLoading ? (
//           <div className="text-center py-8">
//             <Title level={4}>Loading posts...</Title>
//           </div>
//         ) : (
//           <Row gutter={[16, 16]}>
//             {postsData?.posts?.map(post => (
//               <Col xs={24} sm={12} lg={8} key={post._id}>
//                 <Card
//                   hoverable
//                   className="h-full"
//                   cover={
//                     <div className="h-48 overflow-hidden">
//                       <Image
//                         alt={post.title}
//                           src={getImageUrl(post.images[0])} 
//                         className="w-full h-full object-cover"
//                         preview={false}
//                       />
//                     </div>
//                   }
//                   onClick={() => handlePostClick(post)}
//                 >
//                   <Meta
//                     title={
//                       <div className="flex justify-between items-start">
//                         <Text strong className="text-lg">{post.title}</Text>
//                         <Tag color={categoryColors[post.category]} className="capitalize">
//                           {post.category}
//                         </Tag>
//                       </div>
//                     }
//                     description={
//                       <div>
//                         <Text className="text-gray-600 line-clamp-2 mb-2">
//                           {post.description}
//                         </Text>
//                         <div className="flex justify-between items-center mt-4">
//                           <Title level={4} className="mb-0 text-green-600">
//                             ₹{post.price.toLocaleString()}
//                           </Title>
//                           <Button
//                             type="primary"
//                             icon={<PhoneOutlined />}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleCall(post.contactNumber);
//                             }}
//                           >
//                             Call Now
//                           </Button>
//                         </div>
//                         <div className="flex items-center mt-2 text-gray-500">
//                           <Text type="secondary">
//                             {post.location?.village}, {post.location?.city}
//                           </Text>
//                           <div className="ml-auto flex space-x-2">
//                             <Button type="text" icon={<HeartOutlined />} size="small" />
//                             <Button type="text" icon={<ShareAltOutlined />} size="small" />
//                           </div>
//                         </div>
//                       </div>
//                     }
//                   />
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         )}

//         {postsData?.posts?.length === 0 && !isLoading && (
//           <div className="text-center py-12">
//             <Title level={4} className="text-gray-500">No posts found</Title>
//             <Text type="secondary">Try searching for something else</Text>
//           </div>
//         )}
//       </Content>

//       <BottomNavigation />

//       {/* Post Detail Modal */}
//       <Modal
//         title={selectedPost?.title}
//         open={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         footer={null}
//         width={800}
//       >
//         {selectedPost && (
//           <div>
//             <div className="mb-4">
//               <Image.PreviewGroup>
//                 <Row gutter={[8, 8]}>
//                   {selectedPost.images.map((img, index) => (
//                     <Col span={8} key={index}>
//                       <Image src={getImageUrl(img)} className="rounded" />
//                     </Col>
//                   ))}
//                 </Row>
//               </Image.PreviewGroup>
//             </div>
            
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <Tag color={categoryColors[selectedPost.category]} className="capitalize">
//                   {selectedPost.category}
//                 </Tag>
//                 <Title level={3} className="mb-0 text-green-600">
//                   ₹{selectedPost.price.toLocaleString()}
//                 </Title>
//               </div>
              
//               <div>
//                 <Title level={5}>Description</Title>
//                 <Text className="text-gray-700">{selectedPost.description}</Text>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Text strong>Location:</Text>
//                   <div className="text-gray-600">
//                     {selectedPost.location?.village}, {selectedPost.location?.city}<br />
//                     {selectedPost.location?.state} - {selectedPost.location?.pincode}
//                   </div>
//                 </div>
//                 <div>
//                   <Text strong>Seller:</Text>
//                   <div className="text-gray-600">
//                     {selectedPost.user?.firstName} {selectedPost.user?.lastName}
//                   </div>
//                 </div>
//               </div>
              
//               <div className="pt-4 border-t">
//                 <Button 
//                   type="primary" 
//                   size="large" 
//                   icon={<PhoneOutlined />}
//                   onClick={() => handleCall(selectedPost.contactNumber)}
//                   className="w-full"
//                 >
//                   Call Seller: {selectedPost.contactNumber}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </Layout>
//   );
// };

// export default Home;




import React, { useState, useRef } from 'react';
import { 
  Layout, 
  Input, 
  Card, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Image, 
  Modal,
  Carousel,
  Spin,
  Space,
  FloatButton
} from 'antd';
import { 
  SearchOutlined, 
  PhoneOutlined, 
  HeartOutlined, 
  ShareAltOutlined,
  FireOutlined,
  StarOutlined,
  ShoppingOutlined,
  HomeOutlined,
  CarOutlined,
  LaptopOutlined,
  SkinOutlined,
  ToolOutlined,
  BuildOutlined,
  MoreOutlined,
  UpOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getPosts, getPostsByCategory } from '../api/posts';
import BottomNavigation from '../components/BottomNavigation';
import { getImageUrl } from '../api/upload'; 
import { useNavigate } from 'react-router-dom';
import PublicAffiliates from '../components/PublicAffiliates';
import PublicCarousel from '../components/PublicCarousel';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [page] = useState(1);
  const navigate = useNavigate();
  const categoriesRef = useRef(null);

  // Fetch posts based on category
  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', activeCategory, search],
    queryFn: () => {
      if (activeCategory === 'all') {
        return getPosts({ 
          search, 
          page, 
          limit: 12
        });
      } else {
        return getPostsByCategory(activeCategory, { 
          search, 
          page, 
          limit: 12
        });
      }
    },
    refetchOnWindowFocus: false,
  });

  // Categories array
  const categories = [
    { key: 'all', label: 'All', icon: <FireOutlined />, color: '#ff4d4f' },
    { key: 'electronics', label: 'Electronics', icon: <LaptopOutlined />, color: '#1890ff' },
    { key: 'fashion', label: 'Fashion', icon: <SkinOutlined />, color: '#eb2f96' },
    { key: 'home', label: 'Home', icon: <HomeOutlined />, color: '#52c41a' },
    { key: 'vehicles', label: 'Vehicles', icon: <CarOutlined />, color: '#fa8c16' },
    { key: 'property', label: 'Property', icon: <BuildOutlined />, color: '#722ed1' },
    { key: 'services', label: 'Services', icon: <ToolOutlined />, color: '#13c2c2' },
    { key: 'others', label: 'Others', icon: <MoreOutlined />, color: '#bfbfbf' }
  ];

  // Scroll categories left/right
  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = 200;
      categoriesRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(categoryKey);
  };

  const categoryColors = {
    electronics: 'blue',
    fashion: 'magenta',
    home: 'green',
    vehicles: 'orange',
    property: 'purple',
    services: 'cyan',
    others: 'gray'
  };

  return (
    <Layout className="min-h-screen bg-white">
      {/* Fixed Header */}
      <Header className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 fixed w-full z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
              <img className='w-[50px]  h-[40px] rounded-full ' src="https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/18.21-807807473443236500.jpeg" alt="" />
            </div>
            <Title onClick={()=>window.location.href='/admin-log'} level={4} className="!text-white mb-0">Nagori Bazar</Title>
          </div>
          <Button 
            type="text"
            onClick={()=>window.location.href='/phonebook'} 
            icon={<PhoneOutlined />} 
            className="text-white"
         >

          PhoneBook
         </Button>
        </div>
        
        <div className="mt-3">
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-full border-0"
            size="large"
          />
        </div>
      </Header>

      {/* Main Content */}
      <Content className="pt-32 px-3 pb-24">
        {/* Banner Carousel */}
        {/* <div className="mb-4">
          <Carousel autoplay className="rounded-xl overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-40 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <Title level={3} className="text-white mb-1">Great Deals</Title>
                  <Text className="text-white/80">Shop now and save</Text>
                </div>
              </div>
            ))}
          </Carousel>
        </div> */}



<PublicCarousel/>



<PublicAffiliates />





        {/* Categories - Single Line with Scroll */}
        <div className="mb-6 relative">
          <div className="flex items-center justify-between mb-2">
            <Title level={5} className="mb-0">Categories</Title>
            <div className="flex space-x-1">
              <Button 
                type="text" 
                size="small" 
                icon={<LeftOutlined />}
                onClick={() => scrollCategories('left')}
                className="text-gray-500"
              />
              <Button 
                type="text" 
                size="small" 
                icon={<RightOutlined />}
                onClick={() => scrollCategories('right')}
                className="text-gray-500"
              />
            </div>
          </div>
          
          <div className="relative">
            <div 
              ref={categoriesRef}
              className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryClick(category.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
                    activeCategory === category.key 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                  style={{
                    minWidth: 'fit-content'
                  }}
                >
                  <span style={{ color: category.color }}>
                    {category.icon}
                  </span>
                  <span className={`font-medium ${
                    activeCategory === category.key ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Category Title */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <Title level={4} className="mb-0">
              {activeCategory === 'all' ? 'All Products' : categories.find(c => c.key === activeCategory)?.label}
            </Title>
            <Tag color={categoryColors[activeCategory] || 'blue'} className="capitalize">
              {postsData?.posts?.length || 0} items
            </Tag>
          </div>
          <div className="h-1 w-20 bg-blue-500 rounded-full mt-1"></div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[12, 12]}>
            {postsData?.posts?.map(post => (
              <Col xs={12} sm={12} md={8} lg={6} key={post._id}>
                <Card
                  className="h-full border-0 shadow-sm hover:shadow-md transition-shadow"
                  bodyStyle={{ padding: '12px' }}
                  onClick={() => handlePostClick(post)}
                >
                  {/* Product Image */}
                  <div className="relative mb-3">
                    <div className="h-40 w-full overflow-hidden rounded-lg">
                      <img
                        src={getImageUrl(post.images[0])}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Tag 
                      color={categoryColors[post.category]} 
                      className="absolute top-2 left-2 text-xs"
                    >
                      {post.category}
                    </Tag>
                  </div>

                  {/* Product Info */}
                  <div className="h-24 flex flex-col justify-between">
                    <Text strong className="line-clamp-2 text-sm mb-2">
                      {post.title}
                    </Text>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Title level={5} className="mb-0 text-green-600">
                          ₹{post.price.toLocaleString()}
                        </Title>
                        <Button
                          type="primary"
                          size="small"
                          icon={<PhoneOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCall(post.contactNumber);
                          }}
                          className="bg-blue-600 border-0"
                        >
                          Call
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate">{post.location?.city}</span>
                        <Space size="small">
                          <HeartOutlined className="text-gray-400" />
                          <ShareAltOutlined className="text-gray-400" />
                        </Space>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* No Products Found */}
        {!isLoading && (!postsData?.posts || postsData.posts.length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingOutlined className="text-gray-400 text-2xl" />
            </div>
            <Title level={5} className="text-gray-500 mb-2">No products found</Title>
            <Text type="secondary" className="block mb-4">
              {search ? `No results for "${search}"` : 'Be the first to post!'}
            </Text>
            <Button 
              type="primary"
              onClick={() => navigate('/create-post')}
              size="large"
            >
              Sell Now
            </Button>
          </div>
        )}
      </Content>

      <BottomNavigation />

      {/* Product Detail Modal */}
      <Modal
        title={selectedPost?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        className="product-modal"
      >
        {selectedPost && (
          <div className="space-y-4">
            {/* Image Carousel */}
            <div className="mb-4">
              <Carousel arrows dots={{ className: 'modal-dots' }}>
                {selectedPost.images.map((img, index) => (
                  <div key={index} className="h-64">
                    <img 
                      src={getImageUrl(img)} 
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            
            {/* Product Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Tag color={categoryColors[selectedPost.category]} className="capitalize">
                  {selectedPost.category}
                </Tag>
                <Title level={3} className="mb-0 text-green-600">
                  ₹{selectedPost.price.toLocaleString()}
                </Title>
              </div>
              
              <div>
                <Title level={5} className="mb-2">Description</Title>
                <Text className="text-gray-700">{selectedPost.description}</Text>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Text strong className="block mb-1">📍 Location</Text>
                  <Text type="secondary" className="text-sm">
                    {selectedPost.location?.city}, {selectedPost.location?.state}
                  </Text>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Text strong className="block mb-1">👤 Seller</Text>
                  <Text type="secondary" className="text-sm">
                    {selectedPost.user?.firstName}
                  </Text>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="pt-3 border-t">
                <Space direction="vertical" className="w-full">
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<PhoneOutlined />}
                    onClick={() => handleCall(selectedPost.contactNumber)}
                    className="w-full bg-blue-600 h-12"
                  >
                    Call: {selectedPost.contactNumber}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      type="default" 
                      size="large"
                      icon={<HeartOutlined />}
                      className="w-full h-10"
                    >
                      Save
                    </Button>
                    <Button 
                      type="default" 
                      size="large"
                      icon={<ShareAltOutlined />}
                      className="w-full h-10"
                    >
                      Share
                    </Button>
                  </div>
                </Space>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Scroll to Top Button */}
      <FloatButton.BackTop 
        icon={<UpOutlined />}
        style={{ right: 16, bottom: 80 }}
      />

      {/* Custom CSS */}
      <style jsx>{`
        /* Hide scrollbar for categories */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Product card hover effect */
        .ant-card:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        /* Modal styling */
        :global(.product-modal .ant-modal-content) {
          border-radius: 12px;
        }
        :global(.modal-dots li button) {
          background: #1890ff;
        }
      `}</style>
    </Layout>
  );
};

export default Home;