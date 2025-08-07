import React from 'react';

function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-blue-600 pt-[58px]">
      <div className="max-w-[1200px] mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Your Health,
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Delivered
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-md">
              Get your medications and health products delivered to your doorstep with our safe and reliable online pharmacy service.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg">
                Shop Medicines
              </button>
              <button className="border border-white text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200">
                Upload Prescription
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              {/* Free Delivery */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 text-white">
                  <svg viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6667 15.2V5.19999C11.6667 4.75796 11.4911 4.33404 11.1785 4.02148C10.8659 3.70892 10.442 3.53333 9.99999 3.53333H3.33332C2.8913 3.53333 2.46737 3.70892 2.15481 4.02148C1.84225 4.33404 1.66666 4.75796 1.66666 5.19999V14.3667C1.66666 14.5877 1.75445 14.7996 1.91073 14.9559C2.06701 15.1122 2.27898 15.2 2.49999 15.2H4.16666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12.5 15.2H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.8333 15.1999H17.5C17.721 15.1999 17.933 15.1121 18.0892 14.9558C18.2455 14.7996 18.3333 14.5876 18.3333 14.3666V11.3249C18.333 11.1358 18.2683 10.9524 18.15 10.8049L15.25 7.17991C15.1721 7.08231 15.0732 7.00348 14.9607 6.94924C14.8482 6.89501 14.7249 6.86676 14.6 6.86658H11.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.1667 16.8667C15.0871 16.8667 15.8333 16.1205 15.8333 15.2C15.8333 14.2795 15.0871 13.5333 14.1667 13.5333C13.2462 13.5333 12.5 14.2795 12.5 15.2C12.5 16.1205 13.2462 16.8667 14.1667 16.8667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.83332 16.8667C6.7538 16.8667 7.49999 16.1205 7.49999 15.2C7.49999 14.2795 6.7538 13.5333 5.83332 13.5333C4.91285 13.5333 4.16666 14.2795 4.16666 15.2C4.16666 16.1205 4.91285 16.8667 5.83332 16.8667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">Free Delivery</span>
              </div>

              {/* 24/7 Support */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 text-white">
                  <svg viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_3_71)">
                      <path d="M10.175 18.5332C14.7774 18.5332 18.5083 14.8023 18.5083 10.1999C18.5083 5.59754 14.7774 1.86658 10.175 1.86658C5.5726 1.86658 1.84164 5.59754 1.84164 10.1999C1.84164 14.8023 5.5726 18.5332 10.175 18.5332Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.175 5.19995V10.2L13.5083 11.8666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_3_71">
                        <rect width="20" height="20" fill="white" transform="translate(0.174988 0.199951)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>

              {/* Secure Payment */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 text-white">
                  <svg viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_3_77)">
                      <path d="M17.0667 11.0333C17.0667 15.1999 14.15 17.2833 10.6833 18.4916C10.5018 18.5531 10.3046 18.5502 10.125 18.4833C6.64999 17.2833 3.73332 15.1999 3.73332 11.0333V5.19992C3.73332 4.97891 3.82112 4.76694 3.9774 4.61066C4.13368 4.45438 4.34564 4.36659 4.56666 4.36659C6.23332 4.36659 8.31666 3.36659 9.76666 2.09992C9.9432 1.94908 10.1678 1.86621 10.4 1.86621C10.6322 1.86621 10.8568 1.94908 11.0333 2.09992C12.4917 3.37492 14.5667 4.36659 16.2333 4.36659C16.4543 4.36659 16.6663 4.45438 16.8226 4.61066C16.9789 4.76694 17.0667 4.97891 17.0667 5.19992V11.0333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.89999 10.2L9.56666 11.8667L12.9 8.53333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_3_77">
                        <rect width="20" height="20" fill="white" transform="translate(0.399994 0.199951)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://static.wixstatic.com/media/abe5aa_3ff2132c9a13404494017dab519b1bb1~mv2.jpg/v1/fill/w_568,h_378,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/abe5aa_3ff2132c9a13404494017dab519b1bb1~mv2.jpg"
                alt="Various colorful pills and medications"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
