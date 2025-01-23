import React, { useState } from 'react';
import CopyLogo from '../../media/copy-button.png'

const CopyButton = ({ link, imageSrc, altText }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      id='copy-button'
      onClick={handleCopy}>
      {isCopied ? (
        'Copied!'
      ) : (
        <img
          src={CopyLogo}
          alt='copy-logo'
        />
      )}
    </div>
  );
};

export default CopyButton;
