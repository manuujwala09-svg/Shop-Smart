// src/components/Modals.js
import React, { useEffect, useState } from 'react';
import { addFavorite, addToCart, getFavorites, getCart } from '../services/dbService';

// Generic Modal Wrapper
const Modal = ({ isOpen, close, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
        <button className="modal-close" onClick={close}>×</button>
      </div>
    </div>
  );
};

// LOGIN MODAL
export const LoginModal = ({ isOpen, close }) => {
  return (
    <Modal isOpen={isOpen} close={close}>
      <div className="modal-content">
        <h2>Login</h2>
        <form>
          <input className="modal-input" type="email" placeholder="Email" />
          <input className="modal-input" type="password" placeholder="Password" />
          <button type="submit" className="modal-button login-btn">Login</button>
        </form>
      </div>
    </Modal>
  );
};

// SIGNUP MODAL
export const SignupModal = ({ isOpen, close }) => {
  return (
    <Modal isOpen={isOpen} close={close}>
      <div className="modal-content">
        <h2>Sign Up</h2>
        <form>
          <input className="modal-input" type="text" placeholder="Full Name" />
          <input className="modal-input" type="email" placeholder="Email" />
          <input className="modal-input" type="password" placeholder="Password" />
          <button type="submit" className="modal-button signup-btn">Sign Up</button>
        </form>
      </div>
    </Modal>
  );
};

// FAVORITES MODAL
export const FavoritesModal = ({ isOpen, close }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const data = getFavorites(); // now returns array
    setFavorites(data);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} close={close}>
      <div className="modal-content">
        <h2>Your Favorites</h2>
        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <div className="favorites-list">
            {favorites.map((item, idx) => (
              <div className="favorite-item" key={idx}>
                <img src={item.image} alt={item.name} className="favorite-image" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

// CART MODAL
export const CartModal = ({ isOpen, close }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const data = getCart(); // now returns array
    setCart(data);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} close={close}>
      <div className="modal-content">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <div className="cart-list">
            {cart.map((item, idx) => (
              <div className="cart-item" key={idx}>
                <img src={item.image} alt={item.name} className="cart-image" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
