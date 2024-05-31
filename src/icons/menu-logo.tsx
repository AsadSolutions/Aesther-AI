import React from 'react';

type MenuLogoProps = {
  onClick(): void;
};

export const MenuLogo = ({ onClick }: MenuLogoProps) => {
  return (
    <svg
      onClick={onClick}
      width="40"
      height="40"
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer' }}
    >
      <circle cx="55" cy="55" r="55" fill="#5A7BFA" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35 35C35 32.2386 37.2386 30 40 30H70C72.7614 30 75 32.2386 75 35V75C75 77.7614 72.7614 80 70 80H40C37.2386 80 35 77.7614 35 75V35Z"
        fill="white"
      />
      <circle cx="45" cy="45" r="5" fill="#5A7BFA" />
      <circle cx="65" cy="45" r="5" fill="#5A7BFA" />
      <path
        d="M45 65C45 65 50 70 65 65"
        stroke="#5A7BFA"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
