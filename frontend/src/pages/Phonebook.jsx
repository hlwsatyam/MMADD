// // components/Phonebook.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   PhoneOutlined, 
//   UserOutlined, 
//   EnvironmentOutlined,
//   LeftOutlined,
//   RightOutlined,
//   SearchOutlined,
//   MenuOutlined,
//   CloseOutlined,
//   BackwardOutlined
// } from '@ant-design/icons';
// import { Input, Spin, message, Avatar, Drawer } from 'antd';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// const Phonebook = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const scrollRef = useRef(null);
//   const mobileScrollRef = useRef(null);
//   const { token } = useAuth();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/all-users`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       message.error('फोनबुक लोड करने में समस्या हुई');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Image scrolling data
// const scrollingImages = [
//   {
//     id: 1,
//     url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.09-427275031532317700.png',
//     title: 'Nagori Desi Ghee',
//     desc: 'शुद्धता और असली स्वाद'
//   },
//   {
//     id: 2,
//     url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.09-315073735835144300.png',
//     title: 'Nagori Bajar Special',
//     desc: 'अब आपके शहर में'
//   },
//   {
//     id: 3,
//     url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.10-379463424856491260.png',
//     title: 'Pure & Premium Quality',
//     desc: 'बच्चों की सेहत और परिवार की मजबूती के लिए'
//   },
//   {
//     id: 4,
//     url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.10-808702705670225400.png',
//     title: 'Nagori Buffalo Ghee',
//     desc: 'पारंपरिक स्वाद और पौष्टिकता से भरपूर'
//   },
//   {
//     id: 5,
//     url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.11-967085627087024600.png',
//     title: 'Earn Smartly',
//     desc: '  अपना ब्रांड शुरू करें'
//   },
// ];

//   // Auto scroll images for mobile
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % scrollingImages.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   // Filter users based on search
//   const filteredUsers = users.filter(user => {
//     const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
//     const caste = (user.caste || '').toLowerCase();
//     const village = (user.village || '').toLowerCase();
//     const search = searchTerm.toLowerCase();
    
//     return fullName.includes(search) || caste.includes(search) || village.includes(search);
//   });

//   const showUserDetails = (user) => {
//     setSelectedUser(user);
//     setDrawerVisible(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
//       {/* Mobile Header */}
//       <div className="lg:hidden sticky top-0 z-50 bg-white shadow-lg">
//         <div className="flex items-center justify-between p-4">

// <button className="p-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg">
//             <BackwardOutlined onClick={()=>window.location.href='/'} />
//           </button>


//           <div>




            
//             <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
//               अपने लोग
//             </h1>
//             <p className="text-xs text-gray-500">PHONE BOOK • फोन बुक</p>
//           </div>
          
//         </div>
        
//         {/* Mobile Search */}
//         <div className="px-4 pb-4">
//           <Input
//             size="middle"
//             placeholder="🔍 नाम, जाति, गांव..."
//             prefix={<SearchOutlined className="text-red-400" />}
//             className="rounded-full border-2 border-red-200 focus:border-red-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Desktop Header (hidden on mobile) */}
//       <div className="hidden lg:block max-w-7xl mx-auto p-4">
//         <div className="text-center mb-8 relative">
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-32 h-32 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
//           </div>
//           <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-2 relative">
//             अपने लोग
//           </h1>
//           <div className="flex items-center justify-center space-x-4">
//             <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-red-500"></div>
//             <h2 className="text-3xl font-bold text-gray-800">
//               PHONE BOOK <span className="text-sm text-gray-500 ml-2">फोन बुक</span>
//             </h2>
//             <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-red-500"></div>
//           </div>
//         </div>

//         {/* Desktop Search */}
//         <div className="mb-8 transform hover:scale-105 transition-transform duration-300 max-w-2xl mx-auto">
//           <Input
//             size="large"
//             placeholder="🔍 नाम, जाति या गांव से खोजें..."
//             prefix={<SearchOutlined className="text-red-400" />}
//             className="rounded-full border-2 border-red-200 focus:border-red-500 shadow-lg py-3 text-lg"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-2 lg:px-4">
//         {/* Mobile Image Slider - Left Right Scroll */}
//         <div className="lg:hidden mb-6">
//           <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center px-2">
//             <span className="bg-gradient-to-r from-red-500 to-orange-500 w-1.5 h-6 rounded-full mr-2"></span>
//             इमेज गैलरी
//           </h3>
          
//           {/* Horizontal Scroll Images for Mobile */}
//           <div className="relative">
//             <div 
//               ref={mobileScrollRef}
//               className="flex overflow-x-auto space-x-3 pb-4 scrollbar-hide px-2"
//               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//               {scrollingImages.map((img, index) => (
//                 <div 
//                   key={img.id}
//                   className="flex-none w-64 rounded-xl overflow-hidden shadow-lg bg-white"
//                 >
//                   <img 
//                     src={img.url} 
//                     alt={img.title}
//                     className="w-full h-32 object-cover"
//                   />
//                   <div className="p-2">
//                     <p className="font-bold text-sm text-gray-800">{img.title}</p>
//                     <p className="text-xs text-gray-500">{img.desc}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* Scroll Indicators */}
//             <div className="flex justify-center mt-2 space-x-1">
//               {scrollingImages.map((_, index) => (
//                 <div 
//                   key={index}
//                   className={`h-1 rounded-full transition-all duration-300 ${
//                     index === currentImageIndex ? 'w-6 bg-red-500' : 'w-1 bg-gray-300'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Desktop Image Gallery */}
//         <div className="hidden lg:block mt-12 mb-8">
//           <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
//             <span className="bg-gradient-to-r from-red-500 to-orange-500 w-2 h-8 rounded-full mr-3"></span>
//             <span className="bg-gradient-to-r from-red-600 to-orange-600 text-transparent bg-clip-text">
//               IMAGE GALLERY
//             </span>
//             <span className="ml-3 text-sm text-gray-500 font-normal">इमेज गैलरी</span>
//           </h3>
          
//           <div className="relative">
//             {/* Big Center Image */}
//             <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-6 border-4 border-white">
//               <img 
//                 src={scrollingImages[currentImageIndex].url}
//                 alt={scrollingImages[currentImageIndex].title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
//               <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
//                 <h4 className="text-3xl font-bold mb-2">{scrollingImages[currentImageIndex].title}</h4>
//                 <p className="text-xl opacity-90">{scrollingImages[currentImageIndex].desc}</p>
//               </div>
//             </div>

//             {/* Desktop Scroll Buttons */}
//             <button 
//               onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
//               className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gradient-to-r from-red-500 to-orange-500 text-red-500 hover:text-white p-4 rounded-full shadow-2xl"
//             >
//               <LeftOutlined className="text-xl" />
//             </button>
            
//             <button 
//               onClick={() => setCurrentImageIndex(prev => Math.min(scrollingImages.length - 1, prev + 1))}
//               className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gradient-to-r from-red-500 to-orange-500 text-red-500 hover:text-white p-4 rounded-full shadow-2xl"
//             >
//               <RightOutlined className="text-xl" />
//             </button>
//           </div>
//         </div>

//         {/* Phonebook List - Center me full phonebook */}
//         {loading ? (
//           <div className="flex justify-center items-center h-96">
//             <Spin size="large" tip="फोनबुक लोड हो रहा है..." />
//           </div>
//         ) : (
//           <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-3 lg:p-6 mb-8 border border-red-100">
//             <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 flex items-center">
//               <span className="bg-gradient-to-r from-red-500 to-orange-500 w-1.5 h-6 rounded-full mr-2"></span>
//               📞 फोनबुक डायरेक्टरी • {filteredUsers.length} कॉन्टैक्ट्स
//             </h2>
            
//             <div className="space-y-3 lg:space-y-4">
//               {filteredUsers.map((user, index) => (
//                 <div 
//                   key={user._id} 
//                   onClick={() => showUserDetails(user)}
//                   className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 shadow-sm hover:shadow-md transition-all duration-300 active:scale-98 cursor-pointer"
//                 >
//                   {/* Mobile View Card */}
//                   <div className="lg:hidden">
//                     <div className="flex items-center space-x-3">
//                       {/* Serial Number */}
//                       <div className="text-2xl font-bold text-red-500 w-8">
//                         {index + 1}
//                       </div>
                      
//                       {/* Avatar */}
//                       <Avatar 
//                         size={50} 
//                         icon={<UserOutlined />}
//                         className="border-2 border-red-200"
//                         style={{ backgroundColor: `hsl(${index * 40}, 70%, 60%)` }}
//                       />
                      
//                       {/* Basic Info */}
//                       <div className="flex-1">
//                         <div className="flex items-center flex-wrap gap-1">
//                           <h3 className="font-bold text-gray-800">
//                             {user.firstName} {user.lastName}
//                           </h3>
//                           <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
//                             {user.caste || 'General'}
//                           </span>
//                         </div>
                        
//                         <div className="flex items-center text-sm text-gray-600 mt-1">
//                           <PhoneOutlined className="text-green-500 mr-1 text-xs" />
//                           <span className="font-mono">{user.mobileNumber || 'N/A'}</span>
//                         </div>
                        
//                         {/* Job Status Badges */}
//                         <div className="flex mt-1 space-x-1">
//                           {user.lookingForJob && (
//                             <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
//                               🔍 नौकरी
//                             </span>
//                           )}
//                           {user.canProvideJob && (
//                             <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                               💼 नियोक्ता
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Desktop View Card */}
//                   <div className="hidden lg:flex items-start space-x-4">
//                     <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-orange-600 w-16">
//                       {String(index + 1).padStart(2, '0')}
//                     </div>

//                     <div className="flex-1">
//                       <div className="flex flex-wrap items-center gap-2 mb-2">
//                         <h3 className="text-2xl font-bold text-gray-800">
//                           {user.firstName} <span className="text-red-600">{user.lastName}</span>
//                         </h3>
//                         <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm">
//                           {user.caste || 'General'}
//                         </span>
//                       </div>

//                       <div className="flex items-center space-x-3 mb-2">
//                         <PhoneOutlined className="text-green-600" />
//                         <span className="text-lg font-mono">{user.mobileNumber || 'N/A'}</span>
//                       </div>

//                       <div className="flex items-start space-x-2">
//                         <EnvironmentOutlined className="text-blue-600 mt-1" />
//                         <div>
//                           <p>{user.address || 'पता नहीं'}</p>
//                           {user.village && (
//                             <p className="text-sm text-gray-500">
//                               गांव: {user.village}, {user.city}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       {(user.lookingForJob || user.canProvideJob) && (
//                         <div className="mt-2 flex space-x-2">
//                           {user.lookingForJob && (
//                             <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
//                               ✓ नौकरी चाहिए
//                             </span>
//                           )}
//                           {user.canProvideJob && (
//                             <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
//                               🏢 नौकरी देंगे
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <Avatar 
//                       size={70} 
//                       icon={<UserOutlined />}
//                       className="border-4 border-white shadow-xl"
//                       style={{ backgroundColor: `hsl(${index * 50}, 70%, 60%)` }}
//                     />
//                   </div>
//                 </div>
//               ))}

//               {filteredUsers.length === 0 && (
//                 <div className="text-center py-12">
//                   <div className="text-6xl mb-4">😕</div>
//                   <p className="text-xl text-gray-500">कोई कॉन्टैक्ट नहीं मिला</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

    

//       {/* Desktop Footer */}
//       <footer className="hidden lg:block mt-12 text-center py-6 border-t border-red-200">
//         <p className="text-gray-600">
//           © 2024 <span className="font-bold text-red-600">अपने लोग</span> | All rights reserved
//         </p>
//         <p className="text-sm text-gray-500 mt-2">
//           अपने शहर की पहली डिजिटल फोनबुक
//         </p>
//       </footer>

//       {/* User Details Drawer for Mobile */}
//       <Drawer
//         title="कॉन्टैक्ट डिटेल्स"
//         placement="bottom"
//         height="auto"
//         onClose={() => setDrawerVisible(false)}
//         open={drawerVisible}
//         className="lg:hidden"
//       >
//         {selectedUser && (
//           <div className="space-y-4">
//             <div className="flex items-center space-x-4">
//               <Avatar 
//                 size={80} 
//                 icon={<UserOutlined />}
//                 className="border-4 border-red-200"
//               />
//               <div>
//                 <h3 className="text-2xl font-bold">
//                   {selectedUser.firstName} {selectedUser.lastName}
//                 </h3>
//                 <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
//                   {selectedUser.caste || 'General'}
//                 </span>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-xl space-y-3">
//               <div className="flex items-center space-x-3">
//                 <PhoneOutlined className="text-green-600 text-xl" />
//                 <span className="text-lg">{selectedUser.mobileNumber || 'N/A'}</span>
//               </div>
              
//               <div className="flex items-start space-x-3">
//                 <EnvironmentOutlined className="text-blue-600 text-xl mt-1" />
//                 <div>
//                   <p>{selectedUser.address || 'पता नहीं'}</p>
//                   {selectedUser.village && (
//                     <p className="text-sm text-gray-500">
//                       {selectedUser.village}, {selectedUser.city}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {(selectedUser.lookingForJob || selectedUser.canProvideJob) && (
//                 <div className="border-t pt-3">
//                   {selectedUser.lookingForJob && (
//                     <p className="text-green-700">✓ नौकरी की तलाश में हैं</p>
//                   )}
//                   {selectedUser.canProvideJob && (
//                     <p className="text-blue-700">🏢 लोगों को नौकरी देंगे</p>
//                   )}
//                 </div>
//               )}
//             </div>

//             <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-bold">
//               कॉल करें
//             </button>
//           </div>
//         )}
//       </Drawer>

//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .active\:scale-98:active {
//           transform: scale(0.98);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Phonebook;









// components/Phonebook.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOutlined, 
  UserOutlined, 
  EnvironmentOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  BackwardOutlined
} from '@ant-design/icons';
import { Input, Spin, message, Avatar, Drawer } from 'antd';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Phonebook = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const scrollRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto scroll images for BOTH mobile and desktop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % scrollingImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/all-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('फोनबुक लोड करने में समस्या हुई');
    } finally {
      setLoading(false);
    }
  };

  // Image scrolling data
  const scrollingImages = [
    {
      id: 1,
      url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.09-427275031532317700.png',
      title: 'Nagori Desi Ghee',
      desc: 'शुद्धता और असली स्वाद'
    },
    {
      id: 2,
      url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.09-315073735835144300.png',
      title: 'Nagori Bajar Special',
      desc: 'अब आपके शहर में'
    },
    {
      id: 3,
      url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.10-379463424856491260.png',
      title: 'Pure & Premium Quality',
      desc: 'बच्चों की सेहत और परिवार की मजबूती के लिए'
    },
    {
      id: 4,
      url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.10-808702705670225400.png',
      title: 'Nagori Buffalo Ghee',
      desc: 'पारंपरिक स्वाद और पौष्टिकता से भरपूर'
    },
    {
      id: 5,
      url: 'https://dynamic.techmintlab.com/uploads/img-to-url/2026/02/26/20.11-967085627087024600.png',
      title: 'Earn Smartly',
      desc: 'अपना ब्रांड शुरू करें'
    },
  ];

  // Mobile ke liye horizontal scroll ko auto-scroll karne ka function
  useEffect(() => {
    if (mobileScrollRef.current) {
      const scrollToIndex = () => {
        const container = mobileScrollRef.current;
        const childWidth = container.children[0]?.offsetWidth || 256; // 256px width with padding
        const scrollAmount = currentImageIndex * (childWidth + 12); // 12px is the gap
        container.scrollTo({
          left: scrollAmount,
          behavior: 'smooth'
        });
      };
      
      scrollToIndex();
    }
  }, [currentImageIndex]);

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const caste = (user.caste || '').toLowerCase();
    const village = (user.village || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || caste.includes(search) || village.includes(search);
  });

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <button className="p-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg">
            <BackwardOutlined onClick={()=>window.location.href='/'} />
          </button>

          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              अपने लोग
            </h1>
            <p className="text-xs text-gray-500">PHONE BOOK • फोन बुक</p>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="px-4 pb-4">
          <Input
            size="middle"
            placeholder="🔍 नाम, जाति, गांव..."
            prefix={<SearchOutlined className="text-red-400" />}
            className="rounded-full border-2 border-red-200 focus:border-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Header (hidden on mobile) */}
      <div className="hidden lg:block max-w-7xl mx-auto p-4">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-2 relative">
            अपने लोग
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-red-500"></div>
            <h2 className="text-3xl font-bold text-gray-800">
              PHONE BOOK <span className="text-sm text-gray-500 ml-2">फोन बुक</span>
            </h2>
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-red-500"></div>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300 max-w-2xl mx-auto">
          <Input
            size="large"
            placeholder="🔍 नाम, जाति या गांव से खोजें..."
            prefix={<SearchOutlined className="text-red-400" />}
            className="rounded-full border-2 border-red-200 focus:border-red-500 shadow-lg py-3 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 lg:px-4">
        {/* Mobile Image Slider - Left Right Scroll */}
        <div className="lg:hidden mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center px-2">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 w-1.5 h-6 rounded-full mr-2"></span>
            इमेज गैलरी
          </h3>
          
          {/* Horizontal Scroll Images for Mobile */}
          <div className="relative">
            <div 
              ref={mobileScrollRef}
              className="flex overflow-x-auto space-x-3 pb-4 scrollbar-hide px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {scrollingImages.map((img, index) => (
                <div 
                  key={img.id}
                  className={`flex-none w-64 rounded-xl overflow-hidden shadow-lg bg-white transition-all duration-300 ${
                    index === currentImageIndex ? 'ring-2 ring-red-500 ring-offset-2' : ''
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={img.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <p className="font-bold text-sm text-gray-800">{img.title}</p>
                    <p className="text-xs text-gray-500">{img.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scroll Indicators */}
            <div className="flex justify-center mt-2 space-x-1">
              {scrollingImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'w-6 bg-red-500' : 'w-1.5 bg-gray-300 hover:bg-red-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Image Gallery */}
        <div className="hidden lg:block mt-12 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 w-2 h-8 rounded-full mr-3"></span>
            <span className="bg-gradient-to-r from-red-600 to-orange-600 text-transparent bg-clip-text">
              IMAGE GALLERY
            </span>
            <span className="ml-3 text-sm text-gray-500 font-normal">इमेज गैलरी</span>
          </h3>
          
          <div className="relative">
            {/* Big Center Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-6 border-4 border-white">
              <img 
                key={currentImageIndex} // Key add kiya taaki image change pe re-render ho
                src={scrollingImages[currentImageIndex].url}
                alt={scrollingImages[currentImageIndex].title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h4 className="text-3xl font-bold mb-2">{scrollingImages[currentImageIndex].title}</h4>
                <p className="text-xl opacity-90">{scrollingImages[currentImageIndex].desc}</p>
              </div>
            </div>

            {/* Desktop Scroll Buttons */}
            <button 
              onClick={() => setCurrentImageIndex(prev => (prev - 1 + scrollingImages.length) % scrollingImages.length)}
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gradient-to-r from-red-500 to-orange-500 text-red-500 hover:text-white p-4 rounded-full shadow-2xl transition-all duration-300"
            >
              <LeftOutlined className="text-xl" />
            </button>
            
            <button 
              onClick={() => setCurrentImageIndex(prev => (prev + 1) % scrollingImages.length)}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gradient-to-r from-red-500 to-orange-500 text-red-500 hover:text-white p-4 rounded-full shadow-2xl transition-all duration-300"
            >
              <RightOutlined className="text-xl" />
            </button>

            {/* Thumbnail Indicators for Desktop */}
            <div className="flex justify-center space-x-2 mt-4">
              {scrollingImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'w-8 bg-gradient-to-r from-red-500 to-orange-500' 
                      : 'w-2 bg-gray-300 hover:bg-red-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Phonebook List - Center me full phonebook */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spin size="large" tip="फोनबुक लोड हो रहा है..." />
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-3 lg:p-6 mb-8 border border-red-100">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 w-1.5 h-6 rounded-full mr-2"></span>
              📞 फोनबुक डायरेक्टरी • {filteredUsers.length} कॉन्टैक्ट्स
            </h2>
            
            <div className="space-y-3 lg:space-y-4">
              {filteredUsers.map((user, index) => (
                <div 
                  key={user._id} 
                  onClick={() => showUserDetails(user)}
                  className="bg-white border border-gray-200 rounded-xl p-3 lg:p-4 shadow-sm hover:shadow-md transition-all duration-300 active:scale-98 cursor-pointer"
                >
                  {/* Mobile View Card */}
                  <div className="lg:hidden">
                    <div className="flex items-center space-x-3">
                      {/* Serial Number */}
                      <div className="text-2xl font-bold text-red-500 w-8">
                        {index + 1}
                      </div>
                      
                      {/* Avatar */}
                      <Avatar 
                        size={50} 
                        icon={<UserOutlined />}
                        className="border-2 border-red-200"
                        style={{ backgroundColor: `hsl(${index * 40}, 70%, 60%)` }}
                      />
                      
                      {/* Basic Info */}
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-1">
                          <h3 className="font-bold text-gray-800">
                            {user.firstName} {user.lastName}
                          </h3>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            {user.caste || 'General'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <PhoneOutlined className="text-green-500 mr-1 text-xs" />
                          <span className="font-mono">{user.mobileNumber || 'N/A'}</span>
                        </div>
                        
                        {/* Job Status Badges */}
                        <div className="flex mt-1 space-x-1">
                          {user.lookingForJob && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              🔍 नौकरी
                            </span>
                          )}
                          {user.canProvideJob && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              💼 नियोक्ता
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View Card */}
                  <div className="hidden lg:flex items-start space-x-4">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-orange-600 w-16">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {user.firstName} <span className="text-red-600">{user.lastName}</span>
                        </h3>
                        <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm">
                          {user.caste || 'General'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 mb-2">
                        <PhoneOutlined className="text-green-600" />
                        <span className="text-lg font-mono">{user.mobileNumber || 'N/A'}</span>
                      </div>

                      <div className="flex items-start space-x-2">
                        <EnvironmentOutlined className="text-blue-600 mt-1" />
                        <div>
                          <p>{user.address || 'पता नहीं'}</p>
                          {user.village && (
                            <p className="text-sm text-gray-500">
                              गांव: {user.village}, {user.city}
                            </p>
                          )}
                        </div>
                      </div>

                      {(user.lookingForJob || user.canProvideJob) && (
                        <div className="mt-2 flex space-x-2">
                          {user.lookingForJob && (
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                              ✓ नौकरी चाहिए
                            </span>
                          )}
                          {user.canProvideJob && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                              🏢 नौकरी देंगे
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <Avatar 
                      size={70} 
                      icon={<UserOutlined />}
                      className="border-4 border-white shadow-xl"
                      style={{ backgroundColor: `hsl(${index * 50}, 70%, 60%)` }}
                    />
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😕</div>
                  <p className="text-xl text-gray-500">कोई कॉन्टैक्ट नहीं मिला</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Footer */}
      <footer className="hidden lg:block mt-12 text-center py-6 border-t border-red-200">
        <p className="text-gray-600">
          © 2024 <span className="font-bold text-red-600">अपने लोग</span> | All rights reserved
        </p>
        <p className="text-sm text-gray-500 mt-2">
          अपने शहर की पहली डिजिटल फोनबुक
        </p>
      </footer>

      {/* User Details Drawer for Mobile */}
      <Drawer
        title="कॉन्टैक्ट डिटेल्स"
        placement="bottom"
        height="auto"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="lg:hidden"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                className="border-4 border-red-200"
              />
              <div>
                <h3 className="text-2xl font-bold">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  {selectedUser.caste || 'General'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-3">
                <PhoneOutlined className="text-green-600 text-xl" />
                <span className="text-lg">{selectedUser.mobileNumber || 'N/A'}</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <EnvironmentOutlined className="text-blue-600 text-xl mt-1" />
                <div>
                  <p>{selectedUser.address || 'पता नहीं'}</p>
                  {selectedUser.village && (
                    <p className="text-sm text-gray-500">
                      {selectedUser.village}, {selectedUser.city}
                    </p>
                  )}
                </div>
              </div>

              {(selectedUser.lookingForJob || selectedUser.canProvideJob) && (
                <div className="border-t pt-3">
                  {selectedUser.lookingForJob && (
                    <p className="text-green-700">✓ नौकरी की तलाश में हैं</p>
                  )}
                  {selectedUser.canProvideJob && (
                    <p className="text-blue-700">🏢 लोगों को नौकरी देंगे</p>
                  )}
                </div>
              )}
            </div>

        <button
  onClick={() => window.location.href = `tel:${selectedUser.mobileNumber}`}
  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-bold"
>
  कॉल करें
</button>

<button
  onClick={() => window.open(`https://wa.me/${selectedUser.mobileNumber}`, "_blank")}
  className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold"
>
  WhatsApp करें
</button>
          </div>
        )}
      </Drawer>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default Phonebook;







