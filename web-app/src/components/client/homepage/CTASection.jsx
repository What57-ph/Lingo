// src/components/CTASection.jsx
import React from "react";
import { Link } from "react-router-dom"; // Import Link

const CTASection = () => {
  return (
    // Nền 'cta-gradient' (xanh nhạt) của bạn
    <section className="cta-gradient py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Tiêu đề tiếng Anh */}
        <h2 className="text-3xl md:text-5xl font-bold text-blue-950 mb-6 leading-snug">
          Ready to conquer IELTS?
        </h2>
        {/* Mô tả tiếng Anh */}
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join thousands of students who have successfully achieved their IELTS goals with Prep IELTS.
          Start your journey today!
        </p>

        {/* Nút bấm tiếng Anh */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold btn-hover"
          >
            Sign up now
          </Link>
          <Link
            to="/contact"
            className="bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400 px-8 py-4 rounded-full text-lg font-semibold btn-hover"
          >
            Free Consultation
          </Link>
        </div>

        {/* Stats tiếng Anh */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-gray-600 font-medium">Successful Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600 font-medium">Goal Achievement Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">8.2</div>
            <div className="text-gray-600 font-medium">Average Score</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CTASection;