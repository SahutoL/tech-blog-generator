
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 9C6 7.34315 7.34315 6 9 6H23C24.6569 6 26 7.34315 26 9V23C26 24.6569 24.6569 26 23 26H9C7.34315 26 6 24.6569 6 23V9Z"
      stroke="#4F46E5"
      strokeWidth="2.5"
    />
    <path
      d="M11 12L15.5 16.5L11 21"
      stroke="#4338CA"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M18 21H23" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M21.3536 4.64645L22 4L22.6464 4.64645L23.2929 4L24 4.70711L23.2929 5.41421L24 6.12132L23.2929 6.82843L22.6464 6.18198L22 6.82843L21.3536 6.18198L20.7071 6.82843L20 6.12132L20.7071 5.41421L20 4.70711L20.7071 4L21.3536 4.64645Z"
      fill="#A5B4FC"
    />
    <path
      d="M25.8787 9.12132L26.25 8.75L26.6213 9.12132L27 8.75L27.3787 9.12132L27 9.5L27.3787 9.87868L27 10.25L26.6213 9.87868L26.25 10.25L25.8787 9.87868L25.5 10.25L25.1213 9.87868L25.5 9.5L25.1213 9.12132L25.5 8.75L25.8787 9.12132Z"
      fill="#C7D2FE"
    />
  </svg>
);
