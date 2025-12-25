import React from 'react';

interface AuthFormContainerProps {
  title: string;
  children: React.ReactNode;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-8 md:p-10 lg:p-12">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            MoneyMateX - Your Personal Finance Companion
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthFormContainer;