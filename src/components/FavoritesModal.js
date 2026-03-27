// src/components/Modals/FavoritesModal.js
import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // your generic Modal component
import { db, auth } from '../../firebase';
import { ref, get } from 'firebase/database';

export const FavoritesModal = ({ isOpen, close }) => {
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = auth.currentUser?.uid; // get logged-in user ID
      if (!userId) return; // exit if no user
      try {
        const favoritesRef = ref(db, `users/${userId}/favorites`);
        const snapshot = await get(favoritesRef);
        setFavorites(snapshot.val() || {}); // set empty object if null
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    if (isOpen) fetchFavorites();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} close={close}>
      <div className="modal-content">
        <h2>Your Favorites</h2>
        <div className="favorites-list">
          {Object.keys(favorites).length === 0 ? (
            <p>No favorites yet.</p>
          ) : (
            Object.values(favorites).map((item, idx) => (
              <div className="favorite-item" key={idx}>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="favorite-image" 
                />
                <span>{item.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
