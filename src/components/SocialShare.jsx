import React from 'react';

const SocialShare = ({ productTitle = "Samsung Galaxy S22 Ultra 5G", productUrl = "" }) => {
  const currentUrl = productUrl || window.location.href;
  const shareText = `Check out this amazing ${productTitle}!`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
    instagram: `https://www.instagram.com/`
  };

  const handleShare = (platform) => {
    if (platform === 'instagram') {
      // Instagram doesn't have direct sharing, so just open Instagram
      window.open(shareLinks.instagram, '_blank', 'noopener,noreferrer');
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  };

  return (
    <div className="share-link">
      <span className="font-md-bold color-brand-3 mr-15 d-none d-lg-inline-block">Share</span>
      <a 
        className="facebook hover-up" 
        onClick={() => handleShare('facebook')}
        title="Share on Facebook"
        style={{ cursor: 'pointer', color: 'white !important' }}
      >
        <i className="fab fa-facebook-f" style={{ color: 'white' }}></i>
      </a>
      <a 
        className="printest hover-up" 
        onClick={() => handleShare('pinterest')}
        title="Share on Pinterest"
        style={{ cursor: 'pointer', color: 'white !important' }}
      >
        <i className="fab fa-pinterest-p" style={{ color: 'white' }}></i>
      </a>
      <a 
        className="twitter hover-up" 
        onClick={() => handleShare('twitter')}
        title="Share on Twitter"
        style={{ cursor: 'pointer', color: 'white !important' }}
      >
        <i className="fab fa-twitter" style={{ color: 'white' }}></i>
      </a>
      <a 
        className="instagram hover-up" 
        onClick={() => handleShare('instagram')}
        title="Share on Instagram"
        style={{ cursor: 'pointer', color: 'white !important' }}
      >
        <i className="fab fa-instagram" style={{ color: 'white' }}></i>
      </a>
    </div>
  );
};

export default SocialShare;
