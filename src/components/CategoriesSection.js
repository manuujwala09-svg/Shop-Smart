// src/components/CategoriesSection.js
import React from 'react';
import './category.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleWhole, faTv, faMobile, faShirt, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';

const categories = [
  { name: 'Fresh', icon: faAppleWhole },
  { name: 'Electronics', icon: faTv },
  { name: 'Mobiles', icon: faMobile },
  { name: 'Fashion', icon: faShirt },
  { name: 'Toys', icon: faPuzzlePiece },
];

const CategoriesSection = () => {
  return (
    <section className="categories-section">
      <div className="section-title">Categories</div>
      <div className="categories-row">
        {categories.map((cat, idx) => (
          <div className="category-card" key={idx}>
            <div className="category-icon">
              <FontAwesomeIcon icon={cat.icon} size="2x" />
            </div>
            <div className="category-name">{cat.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
