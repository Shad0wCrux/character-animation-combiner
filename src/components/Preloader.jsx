import React from "react";

const Preloader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"
        aria-label="Loading"
      />
    </div>
  );
};

export default Preloader;

