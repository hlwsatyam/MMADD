import React from 'react';
import { Card, Spin, Carousel, Tooltip } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { affiliateApi } from '../services/affiliateApi';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';

const PublicAffiliates = () => {
  const { data: affiliates, isLoading, error } = useQuery({
    queryKey: ['public-affiliates'],
    queryFn: () => affiliateApi.getAffiliates({ status: 'active', limit: 100 }),
    select: (response) => response.data.data
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Spin size="large" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-500 bg-gradient-to-br from-indigo-50 to-purple-50">
      Failed to load affiliates
    </div>
  );

  return (
    <div className="  bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 mb-2">Our Partners</h1>
          <p className="text-gray-500 text-sm">Discover amazing products</p>
        </div>

        {!affiliates?.length ? (
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <UserOutlined className="text-4xl mb-3 text-indigo-300" />
            <p className="text-gray-600">No affiliates available</p>
          </div>
        ) : (
          <Carousel 
            autoplay 
            autoplaySpeed={3000}
            dots={{ className: 'custom-dots' }}
            className="rounded-2xl"
          >
            {affiliates.map((affiliate) => (
              <div key={affiliate._id}>
                <a 
                  href={affiliate.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => affiliateApi.trackClick(affiliate._id)}
                >
                  <Card
                    cover={
                      <div className="h-48 overflow-hidden rounded-t-2xl">
                        <img
                          alt={affiliate.name}
                          src={`${process.env.REACT_APP_API_IMG_URL}${affiliate.image}`}
                          className="w-full h-full  object-contain hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    }
                    className="shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border-0"
                    bodyStyle={{ padding: '16px' }}
                  >
                   
            
                    
                  </Card>
                </a>
              </div>
            ))}
          </Carousel>
        )}
      </div>

      <style jsx>{`
        .custom-dots {
          position: relative;
          bottom: -20px;
        }
        .custom-dots li button {
          background: #cbd5e1 !important;
        }
        .custom-dots li.slick-active button {
          background: #4f46e5 !important;
        }
      `}</style>
    </div>
  );
};

export default PublicAffiliates;