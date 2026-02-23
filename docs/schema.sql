-- Virtual Art Gallery Platform - MySQL Schema

CREATE DATABASE IF NOT EXISTS virtual_art_gallery;
USE virtual_art_gallery;

CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES
('ADMIN'), ('ARTIST'), ('VISITOR'), ('CURATOR');

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id BIGINT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE artworks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  artist_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cultural_info TEXT,
  historical_info TEXT,
  culture VARCHAR(120),
  period_label VARCHAR(120),
  category VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  moderation_note VARCHAR(255),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_artworks_artist FOREIGN KEY (artist_id) REFERENCES users(id)
);

CREATE TABLE artwork_reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  artwork_id BIGINT NOT NULL,
  visitor_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_artwork FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_visitor FOREIGN KEY (visitor_id) REFERENCES users(id),
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
);

CREATE TABLE wishlists (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  visitor_id BIGINT NOT NULL,
  artwork_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_wishlist_visitor FOREIGN KEY (visitor_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_artwork FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
  UNIQUE KEY uq_wishlist_item (visitor_id, artwork_id)
);

CREATE TABLE carts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  visitor_id BIGINT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_visitor FOREIGN KEY (visitor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  cart_id BIGINT NOT NULL,
  artwork_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_artwork FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
  UNIQUE KEY uq_cart_item (cart_id, artwork_id)
);

CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  visitor_id BIGINT NOT NULL,
  status ENUM('PENDING','PAID','FAILED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(40),
  purchaser_name VARCHAR(150),
  mobile VARCHAR(20),
  address TEXT,
  landmark VARCHAR(200),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_visitor FOREIGN KEY (visitor_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  artwork_id BIGINT NOT NULL,
  artist_id BIGINT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_artwork FOREIGN KEY (artwork_id) REFERENCES artworks(id),
  CONSTRAINT fk_order_items_artist FOREIGN KEY (artist_id) REFERENCES users(id)
);

CREATE TABLE exhibitions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  curator_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  theme VARCHAR(160) NOT NULL,
  culture_focus VARCHAR(120),
  commentary TEXT,
  virtual_tour_label VARCHAR(160),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_exhibitions_curator FOREIGN KEY (curator_id) REFERENCES users(id)
);

CREATE TABLE exhibition_artworks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  exhibition_id BIGINT NOT NULL,
  artwork_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exhibition_artwork_exhibition FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id) ON DELETE CASCADE,
  CONSTRAINT fk_exhibition_artwork_artwork FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
  UNIQUE KEY uq_exhibition_artwork (exhibition_id, artwork_id)
);

CREATE TABLE conversations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  visitor_id BIGINT NOT NULL,
  artist_id BIGINT NOT NULL,
  artwork_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_conversations_visitor FOREIGN KEY (visitor_id) REFERENCES users(id),
  CONSTRAINT fk_conversations_artist FOREIGN KEY (artist_id) REFERENCES users(id),
  CONSTRAINT fk_conversations_artwork FOREIGN KEY (artwork_id) REFERENCES artworks(id)
);

CREATE TABLE messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE INDEX idx_artworks_status ON artworks(status);
CREATE INDEX idx_artworks_artist ON artworks(artist_id);
CREATE INDEX idx_artworks_category ON artworks(category);
CREATE INDEX idx_artworks_culture ON artworks(culture);
CREATE INDEX idx_orders_visitor ON orders(visitor_id);
CREATE INDEX idx_reviews_artwork ON artwork_reviews(artwork_id);
