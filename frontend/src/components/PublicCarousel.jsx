import React, { useState, useEffect } from 'react';
import { Carousel, Spin, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_IMG_URL}/api/ads/public`;

const PublicCarousel = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveAds();
  }, []);

  const fetchActiveAds = async () => {
    try {
      const response = await axios.get(API_URL);
      setAds(response.data.data);
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
        <Empty description="No active ads" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel
        autoplay
        autoplaySpeed={4000}
        className="w-full"
        prevArrow={<LeftOutlined className="text-white text-xl" />}
        nextArrow={<RightOutlined className="text-white text-xl" />}
        dots={true}
      >
        {ads.map((ad) => (
          <div key={ad._id} className="relative group">
            {/* Image Container - Chota height */}
            <div className="relative h-48 md:h-64 w-full overflow-hidden">
              <img
                src={`${process.env.REACT_APP_API_IMG_URL}${ad.image}`}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              
              {/* Simple Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Simple Text Content - Center aligned */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-center px-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">
                    {ad.title}
                  </h2>
                  {ad.description && (
                    <p className="text-sm md:text-base text-gray-200">
                      {ad.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <style jsx>{`
        /* Custom dots - chhote */
        .slick-dots {
          bottom: 10px;
        }
        .slick-dots li button {
          background: white !important;
          opacity: 0.5;
          width: 30px !important;
          height: 3px !important;
          border-radius: 2px !important;
        }
        .slick-dots li.slick-active button {
          opacity: 1;
          width: 40px !important;
        }
        
        /* Custom arrows - chhote */
        .slick-prev, .slick-next {
          z-index: 10;
          width: 35px;
          height: 35px;
          background: rgba(0,0,0,0.3) !important;
          border-radius: 50%;
          transition: all 0.3s;
        }
        .slick-prev:hover, .slick-next:hover {
          background: rgba(0,0,0,0.5) !important;
        }
        .slick-prev {
          left: 15px !important;
        }
        .slick-next {
          right: 15px !important;
        }
        .slick-prev:before, .slick-next:before {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PublicCarousel;