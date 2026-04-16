import React, { useEffect, useState } from 'react';
import FundWalletModal from './FundWalletModal';
import BankModal from './BankModal';
import CryptoModal from './CryptoModal';

const ModalContainer = ({ showModal, setShowModal }) => {
  const [currentModal, setCurrentModal] = useState('fund-wallet');

  useEffect(() => {
    showModal && (document.body.style.overflow = 'hidden');
    !showModal &&
      ((document.body.style.overflow = 'auto'), setCurrentModal('fund-wallet'));

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  return showModal ? (
    <div
      className={`bg-black/50 backdrop-blur-md fixed inset-0 z-[999] flex justify-center items-center ${
        !showModal && 'hidden'
      }`}
    >
      {currentModal === 'fund-wallet' ? (
        <FundWalletModal
          setShowModal={setShowModal}
          setCurrentModal={setCurrentModal}
        />
      ) : currentModal === 'bank' ? (
        <BankModal setShowModal={setShowModal} />
      ) : (
        currentModal === 'crypto' && <CryptoModal setShowModal={setShowModal} />
      )}
    </div>
  ) : (
    <></>
  );
};

export default ModalContainer;
